/*
 * @Date: 2023-03-02 15:58:11
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-15 00:11:01
 * @FilePath: \web-project\wtw-node\config.js
 * @description: 
 */

// const agentUrl = 'http://127.0.0.1/' // local
const agentUrl = 'http://host.docker.internal:1080' // docker


const allowOrigins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:3010",
    "http://localhost:3011",
    "http://localhost:3012",
    "http://localhost:3013",
    "http://localhost:3014",
    "http://127.0.0.1:3010",
    "http://127.0.0.1:3011",
    "http://127.0.0.1:3012",
    "http://localhost:3013",
    "http://127.0.0.1:3014",
]

const baiduAip = {
    APPID: 'xxxx',
    AK: "xxxx",
    SK: "xxxx"
}

module.exports = {
    allowOrigins,
    baiduAip,
    agentUrl
}
