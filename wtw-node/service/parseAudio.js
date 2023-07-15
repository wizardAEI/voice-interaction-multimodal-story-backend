/*
 * @Date: 2023-03-02 16:03:36
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-11 11:52:04
 * @FilePath: \wtw-node\service\parseAudio.js
 * @description: 
 */
const AipSpeech = require("baidu-aip-sdk").speech;
const { baiduAip } = require("../config")

let client = new AipSpeech(
  baiduAip.APPID,
  baiduAip.AK,
  baiduAip.SK
);

const { readFileSync } = require("fs");

// abandoned
async function parseAudio(file) {
  let voice = readFileSync(file.filepath);
  let voiceBase64 = new Buffer(voice);
  return new Promise((res, rej) => {
    client
      .recognize(voiceBase64, "pcm", 16000, {
        dev_pid: 1737,
      })
      .then(
        function (result) {
          res(result);
        },
        function (err) {
          rej(err);
        }
      );
  });
}

async function parseAudioForChat(buffer) {
  return new Promise((res, rej) => {
    client
      .recognize(buffer, "pcm", 16000, {
        dev_pid: 1537,
      })
      .then(
        function (result) {
          res(result);
        },
        function (err) {
          rej(err);
        }
      );
  });
}

module.exports = {
  parseAudio,
  parseAudioForChat
};
