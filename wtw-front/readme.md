<!--
 * @Date: 2023-01-15 17:56:47
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-02-09 12:19:07
 * @FilePath: \wtw-front\docker-front\readme.md
 * @description: 
-->
压缩成.tar
rz  导入到服务器
linux 使用 tar –xvf xx.tar解压
 * 

查看运行容器，如果有该容器就停止：

docker ps -a

docker stop 容器id

docker rm 容器id



build
docker build .  --tag nginx-front:1.0



开启docker
docker run -it  -p 3010:3010 -p 3011:3011 -p 443:443 -p 80:80 nginx-front:1.0



没问题后，后台运行

Ctrl + P + Q 
