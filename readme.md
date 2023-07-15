<!--
 * @Date: 2023-03-20 21:50:00
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-04-02 08:50:47
 * @FilePath: \web-project\readme.md
 * @description: 
-->
## 切换网络环境
更改config.js中的agentUrl

## 相关key更换
因为开发周期断断续续且没有规范，key管理很凌乱，所以需要更换key的时候，需要更改以下文件：
- wtw-node/config.js
- wtw-node/token.json

## start
- docker-compose build
- docker-compose up