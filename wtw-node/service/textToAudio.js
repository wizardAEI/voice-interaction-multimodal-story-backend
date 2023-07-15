/*
 * @Date: 2023-03-02 21:12:45
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-06 18:16:56
 * @FilePath: \wtw-node\service\textToAudio.js
 * @description: 
 */
const AipSpeech = require("baidu-aip-sdk").speech;
const {baiduAip} = require("../config")
var fs = require('fs');

let client = new AipSpeech(
    baiduAip.APPID,
    baiduAip.AK,
    baiduAip.SK
  );


async function textToAudio(str) {
    // 语音合成, 附带可选参数
    return new Promise((res, rej) => {
        // per 5118 精品语言
        client.text2audio(str, {per: 5118}).then(function(result) {
            if (result.data) {
                res(result.data)
            } else {
                // 服务发生错误
                rej(result)
            }
        }, function(e) {
            // 发生网络错误
            rej(e)
        });
    })
}

module.exports = textToAudio