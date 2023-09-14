# 双向机器人 - Telegram Bot
>开源轻量化双向Telegram机器人

## 项目简介
- 📜 基于 Node.js.SQLite3 打造出高效稳定的机器人服务

- 🌠 轻量化设计: 精简 简洁 为您打造最轻便的使用体验

- ⚡ 体积迷你: 不到 200 行代码却功能完备

- 🌍 全开源: 透明 可靠 为开发者提供无限的可能性

- 💡 功能完整: 管理黑名单、实时反馈，一切尽在掌控

- 🔐 安全可靠: 数据安全，让您无后顾之忧

## 使用教程

### Windows
1. 准备工作

`确保您的计算机上已安装了Node.js`

2. 创建项目文件夹 

`mkdir telegram-bot && cd telegram-bot` |  | `右键桌面新建文件夹`

3. 下载代码

`如果您从GitHub或其他地方下载了代码 确保将其解压到此文件夹`

4. 安装依赖

`打开终端或命令提示符 进入到您的项目文件夹目录并运行` 

`npm install`

`这会根据package.json文件自动安装项目所需的所有依赖`

5. 运行BOT

`node bot.js`

### 宝塔面板
1. 准备工作

`使用Centos等系统 安装宝塔面板 上传文件夹 打开终端进入目录输入` -- `npm i`

2. 下载PM2管理器

`设置运行文件 例:bot.js 启动即可`

### 通用-配置文件.env

`在程序目录新建.env文件填写一下内容`

TELEGRAM_BOT_TOKEN=  #BOT_TOKEN

ADMIN_ID=            #管理员ID

COMMAND_BAN=/ban                        #封禁指令

COMMAND_UNBAN=/unban                    #解封指令

COMMAND_SEND=/send                      #群发指令

COMMAND_UNBANTEXT=禁止聊天               #封禁消息

WELCOME_MESSGAE=已接入对话               #欢迎语

#版权所有 (c) 2023 @Widow_SSS

#未经此许可证的明确书面许可，任何人均不得 合并、发布、分发、再许可或出售本软件的副本。

#本软件仅供研究目的使用。用户使用本软件应遵守相关法律和法规。

#用户在使用本软件时进行的任何违法行为均由用户本人承担全部法律责任，与本软件作者无关。

#使用本软件即表示接受此声明。如果不接受或不理解本声明，请立即停止使用本软件。

>定制开发-电报@Widow_SSS

