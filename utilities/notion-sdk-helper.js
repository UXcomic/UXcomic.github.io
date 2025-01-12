require("dotenv").config()
const { Client, LogLevel } = require("@notionhq/client")

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
    logLevel: LogLevel.DEBUG
})

module.exports = notion
