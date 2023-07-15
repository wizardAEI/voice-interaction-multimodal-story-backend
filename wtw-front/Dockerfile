FROM nginx:stable-alpine
RUN echo $PWD
COPY ./default.conf /etc/nginx/conf.d/default.conf
ADD ./cert/ /etc/nginx/cert/
ADD ./main-app/ /usr/share/nginx/html/
ADD ./chat-app /usr/share/nginx/html/chat-app
ADD ./story-app /usr/share/nginx/html/story-app
ADD ./game-app /usr/share/nginx/html/game-app
