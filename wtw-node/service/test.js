/*
 * @Date: 2023-03-06 17:51:52
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-06 18:12:11
 * @FilePath: \wtw-node\service\test.js
 * @description: 
 */
const fs = require('fs');
const moment = require('moment');

function Test() {
    let { chatGptToken, chatGptExpire } = JSON.parse(fs.readFileSync(__dirname + '/../token.json', 'utf-8'))
    const now = Date.now()
    if(chatGptExpire < now) {
        return false
    }
}

