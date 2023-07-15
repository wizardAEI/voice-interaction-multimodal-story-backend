<!--
 * @Date: 2023-02-09 12:11:29
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-17 18:28:39
 * @FilePath: \wtw-node\readme.md
 * @description: 
-->
## pm2  部署流程
停止
pm2 stop all

删除
pm2 delete all

开始
pm2 start ./app.js -i 3

查看日志
pm2 show 0

pm2自带负载均衡

**注意需要node 18**