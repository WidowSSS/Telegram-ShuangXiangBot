require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();

const { TELEGRAM_BOT_TOKEN, ADMIN_ID, COMMAND_BAN, COMMAND_UNBAN, COMMAND_UNBANTEXT, WELCOME_MESSGAE, COMMAND_SEND } = process.env;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true, request: { family: 4 } });
const db = new sqlite3.Database('ShuangXiang.db');
db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, telegram_id INTEGER UNIQUE, telegram_name TEXT, is_blacklisted INTEGER)");

if (WELCOME_MESSGAE == null || WELCOME_MESSGAE == "") {
    const message = `请检查env环境配置文件.配置欢迎消息`;
    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    return;
}

if (COMMAND_UNBANTEXT == null || COMMAND_UNBANTEXT == "") {
    const message = `请检查env环境配置文件.配置封禁消息`;
    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    return;
}

bot.on('message', (msg) => {
    const { id: chatId, type: chatType, title: groupName } = msg.chat;
    const { id: telegramId, username: telegramName } = msg.from;

    if ('/start'.includes(msg.text)) {
        if (chatId != ADMIN_ID) {
            const message = `${WELCOME_MESSGAE}`;
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        }
        return;
    }

    if (msg.text.startsWith(COMMAND_SEND)) {
        const parts = msg.text.split(' ');
        const args = parts.slice(1);
        if (chatId == ADMIN_ID) {
            if (args.length < 1) {
                const errorMessage = `参数错误，正确格式为：${COMMAND_SEND} + 消息`;
                bot.sendMessage(chatId, errorMessage);
            } else {
                db.all('SELECT telegram_id FROM user', (err, rows) => {
                    if (err) {
                        console.error('查询数据库时出错:', err);
                        return;
                    }
                    rows.forEach((row) => {
                        const userId = row.telegram_id;
                        if(userId != ADMIN_ID){
                            sendMessageToUser(userId, args.join(' '));
                        }
                    });
                });
            }
        }
    }
    
    if (['/ID', '/id'].includes(msg.text)) {
        const message = (chatType === 'group' || chatType === 'supergroup') ?
            `群组用户名: <b>${groupName}</b>\n群组ID: <b>${chatId}</b>` :
            `电报用户名: <b>${telegramName}</b>\n电报ID: <b>${telegramId}</b>`;
        bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        return;
    }

    const insertQuery = `INSERT OR IGNORE INTO user (telegram_id, telegram_name, is_blacklisted) VALUES (?, ?, 0)`;
    if (chatId != ADMIN_ID) {
        db.run(insertQuery, [telegramId, telegramName], err => err && console.error('插入数据库时出错:', err));
    }

    if (chatId == ADMIN_ID && msg.reply_to_message && msg.reply_to_message.forward_from) {
        const originalUserId = msg.reply_to_message.forward_from.id;
        let actionMessage;
        let blacklistStatus;

        if (msg.text === COMMAND_BAN) {
            actionMessage = `用户 ID: ${originalUserId} 已被封禁.`;
            blacklistStatus = 1;
        } else if (msg.text === COMMAND_UNBAN) {
            actionMessage = `用户 ID: ${originalUserId} 已被解封.`;
            blacklistStatus = 0;
        }

        if (actionMessage) {
            const updateQuery = `UPDATE user SET is_blacklisted = ${blacklistStatus} WHERE telegram_id = ?`;
            db.run(updateQuery, [originalUserId], err => {
                const feedback = err ? '发生错误，请稍后重试.' : actionMessage;
                bot.sendMessage(chatId, feedback);
            });
            return;
        }

        bot.sendMessage(originalUserId, `<b>${msg.text}</b>`, { parse_mode: 'HTML' });
        return;
    }

    isUserBlacklisted(telegramId, (err, blacklisted) => {
        if (err) {
            console.error('查询黑名单状态时出错:', err);
            bot.sendMessage(chatId, '发生错误，请稍后重试.');
        } else if (blacklisted) {
            bot.sendMessage(chatId, `${COMMAND_UNBANTEXT}`);
        } else if (chatId != ADMIN_ID) {
            bot.forwardMessage(ADMIN_ID, chatId, msg.message_id);
        }
    });
});

function isUserBlacklisted(telegramId, callback) {
    const query = 'SELECT is_blacklisted FROM user WHERE telegram_id = ?';
    db.get(query, [telegramId], (err, row) => {
        if (err) {
            callback(err);
        } else {
            callback(null, row && row.is_blacklisted === 1);
        }
    });
}

function sendMessageToUser(userId, messageText) {
    bot.sendMessage(userId, messageText)
        .then(() => {
            console.log(`已向用户 ${userId} 发送消息: ${messageText}`);
        })
        .catch((error) => {
            console.error(`向用户 ${userId} 发送消息时出错:`, error);
        });
}
