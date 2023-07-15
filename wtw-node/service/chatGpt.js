/*
 * @Date: 2023-03-02 16:07:35
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-15 01:05:42
 * @FilePath: \web-project\wtw-node\service\chatGpt.js
 * @description: 这里请求多个对话模型接口，一旦有一个返回了我们就返回
 */

const fs = require("fs");
const logger = require("../log/logger");
const HttpsProxyAgent = require("https-proxy-agent");
const { default: _fetch } = require("node-fetch");
const { agentUrl } = require("../config");

let unOfficialAPI1, unOfficialAPI2, officialAPI;
import("chatgpt")
  .then(({ ChatGPTUnofficialProxyAPI, ChatGPTAPI }) => {
    // 读取token.json文件，获取token和过期时间
    let { chatGptToken, chatGptExpire, apiKey } = JSON.parse(
      fs.readFileSync(__dirname + "/../token.json", "utf-8")
    );
    const now = Date.now();
    if (chatGptExpire < now) {
      // console.log("chat GPT Token 过期了")
      // logger.logError("chat GPT Token 过期了");
      // throw new Error("chat GPT Token 过期了")
    }
    unOfficialAPI1 = new ChatGPTUnofficialProxyAPI({
      accessToken: chatGptToken,
      apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation",
    });
    unOfficialAPI2 = new ChatGPTUnofficialProxyAPI({
      accessToken: chatGptToken,
      apiReverseProxyUrl: "https://chat.duti.tech/api/conversation",
    });
    // 初始化官方的接口
    officialAPI = new ChatGPTAPI({
      apiKey,
      fetch: (input, init) => {
        console.log(input, init);
        init.redirect = "follow";
        // 定义一个代理，用于请求官方的接口
        // init.agent = new HttpsProxyAgent(agentUrl);
        return _fetch(input, init);
      },
    });
  })
  .catch((e) => {
    logger.logError(e);
    throw e;
  });

/**
 * @description: 请求多个对话模型接口，一旦有一个返回了我们就返回
 * @param {string} msg 对话内容
 * @param {string} parentMessageId 上一次的请求id
 * @param {string} systemMessage 背景故事
 * @param {string} conversationId 交谈id 没有返回就不传
 * @returns
 */
async function chatGpt(msg, parentMessageId, systemMessage, conversationId) {
  // msgPlus = systemMessage ? systemMessage + "现在第一个问题是：" + msg : msg
  // const p1 = unOfficialAPI1.sendMessage(msgPlus, {
  //   parentMessageId,
  //   conversationId
  // });
  // const p2 = unOfficialAPI2.sendMessage(msgPlus, {
  //   parentMessageId,
  //   conversationId
  // });
  // 1. Send a message to the API
  const p3 = officialAPI.sendMessage(msg, {
    parentMessageId,
    systemMessage,
  });
  // 2. Wait for the API to return a response
  let res = "";
  try {
    res = await Promise.any([p3]);
  } catch (err) {
    console.log("失败原因: ", err)
    // If it fails, call the error message function
    res = "API调用失败";
  }
  // 3. Print the response to the console
  console.log(`chatGpt: ${msg} -> ${res}`);
  // 4. Return the response
  return res;
}

module.exports = chatGpt;
