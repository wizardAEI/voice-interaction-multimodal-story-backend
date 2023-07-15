/*
 * @Date: 2023-03-06 17:26:06
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-11 12:52:02
 * @FilePath: \wtw-node\service\chatBaidu.js
 * @description:
 */

const request = require("request");
const fs = require('fs')
const logger = require('../log/logger')

function chatWenxin() {
  
}


// function chatBaidu() {
//   let data = JSON.parse(fs.readFileSync(__dirname + "/../token.json", "utf-8"));
//   const now = Date.now();
//   if (data.baiduUnitExpire < now) {
//     GetToken().then((res) => {
//       data.baiduUnitToken = res;
//       data.baiduUnitExpire = now + 30 * 24 * 60 * 60 * 1000 - 2000 // 30天有效期的时间戳，减2s更加保险
//       fs.writeFile(
//         __dirname + "/../token.json",
//         JSON.stringify(data), (err) => { logger.logError(err) }
//       );
//     });
//   }
//   // 调用 ai 助手 看看能否调用文心一言，unit闲聊太傻了
// }

// async function GetToken() {
//   return new Promise((res, rej) => {
//     var options = {
//       method: "POST",
//       url: "https://aip.baidubce.com/oauth/2.0/token?client_id=9q96C6xoY39LIHw6mF1R3XhB&client_secret=gDErDUq2QhzwmFxUWGsi5noz1IpDMZfj&grant_type=client_credentials",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     };

//     request(options, function (error, response) {
//       if (error) rej(new Error(error));
//       else res(JSON.parse(response.body).access_token);
//     });
//   });
// }
