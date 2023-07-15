/*
 * @Date: 2023-01-16 22:24:23
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-15 01:11:58
 * @FilePath: \web-project\wtw-node\app.js
 * @description: 项目入口文件
 */

const Koa = require("koa");
// const fs = require("fs")
const staticCache = require("koa-static-cache")
const { koaBody } = require("koa-body");
const compress = require('koa-compress');
// const https = require('https')
// const sslify = require('koa-sslify').default
const cors = require("koa2-cors");
const Router = require("koa-router");
const config = require("./config");
const { parseAudio, parseAudioForChat} = require("./service/parseAudio");
const textToAudio = require("./service/textToAudio");
const chatGpt = require("./service/chatGpt");
const logger = require("./log/logger");

const app = new Koa();
const router = new Router();


// 路径为证书放置的位置
// const options = {
//   key: fs.readFileSync('./cert/wtwnode.xyz.key'),
//   cert: fs.readFileSync('./cert/wtwnode.xyz.crt'),
// }
 
// app.use(sslify())  // 使用ssl

// cors
app.use(
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      const whiteList = config.allowOrigins; //可跨域白名单
      let url = ctx.header.origin;
      if (whiteList.some((item) => item.includes(url))) {
        return url; //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
      }
      return "http://localhost:3010"; //只允许http://localhost:3031这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);

// staticCache
app.use(staticCache(__dirname+'/assets/web', {
  prefix: '/assets'
}))
// gzip
const options = { threshold: 2048 };
app.use(compress(options));

// 接收formData
app.use(
  koaBody({
    multipart: true,
    formidable: {
      // 上传目录
      //   uploadDir: path.join(__dirname, "./static"),
      // 保留文件扩展名
      keepExtensions: true,
    },
  })
);

// 解析音频路由
router.post("/parse_audio", async (ctx, next) => {
  const file = ctx.request.body?.file;
  try {
    const res = await parseAudioForChat(new Buffer(file));
    ctx.body = {
      msg: "ok",
      data: res,
    };
  } catch (err) {
    ctx.body = {
      msg: "something wrong (parse_audio)",
      data: err,
    };
    logger.logError(err);
  }
  next();
});

// 语音合成接口
router.get("/text_to_audio", async (ctx, next) => {
  const { msg } = ctx.request.query;
  try {
    const res = await textToAudio(msg);
    ctx.body = {
      msg: "ok",
      data: res,
    };
  } catch (err) {
    ctx.body = {
      msg: "something wrong (text_to_audio)",
      data: err,
    };
    logger.logError(err);
  }
  next();
});

// chatGPT路由
router.get("/chat_withme", async (ctx, next) => {
  let { question, parent_id, system_message, conversation_id } =
    ctx.request.query;
  console.log(ctx.request.query.question)
  if (
    typeof question == "string" &&
    typeof system_message === "string"&&
    typeof parent_id == 'string'
  ) {
    if (question === "") {
      ctx.body = {
        msg: "ok",
        data: {
          text: "想问什么呀小朋友?",
          id: null,
        },
      };
      next();
      return;
    }
    try {
      const res = await chatGpt(
        question.trim(),
        parent_id.trim() ? parent_id.trim() : undefined,
        system_message.trim(),
        // conversation_id.trim()
      );
      ctx.body = {
        msg: "ok",
        data: res,
      };
    } catch (err) {
      ctx.body = {
        msg: "something wrong: " + err,
        data: {
          text: "Sorry, friend. I think I'm sick😥 I can't answer the question for now...",
          id: null,
          conversationId: null,
        },
      };
      logger.logError(err);
    }
    next();
    return;
  }
  ctx.body = {
    msg: "type of question or parent_id is not string",
    data: {
      text: "想问什么呀小朋友?",
      id: null,
      conversationId: null,
    },
  };
  next();
});

// chat路由
router.post("/chat_together", async (ctx, next) => {
  const {file, parent_id, system_message, conversation_id} = ctx.request.body
  try {
    // 语音识别
    const res = await parseAudioForChat(new Buffer(file));
    if (res.err_no !== 0) {
      ctx.body = {
        code: 1,
        msg: "service parseAudio error",
      };
      logger.logError(res.err_msg)
      next();
      return;
    }
    console.log(res)
    if (
      typeof parent_id !== "string" ||
      typeof system_message !== "string" ||
      typeof conversation_id !== "string"
    ) {
      ctx.body = {
        code: 1,
        msg: "parent_id or system_message or conversation_id type wrong",
        data: {},
      };
      return
    }
    const res2 = await chatGpt(res.result[0], parent_id, system_message, conversation_id)
    console.log(res2)
    const res3 = await textToAudio(res2.text)
    console.log(res3)
    ctx.body = {
      code: 0,
      msg: "ok",
      data: {
        question: res.result[0],
        answer: res2.text,
        data: res3,
        id: res2.id,
        conversationId: res2.conversationId,
      },
    };
  } catch (err) {
    ctx.body = {
      code: 1,
      msg: "something wrong (chat_together)",
      data: err,
    };
    logger.logError(err);
    return;
  }
  next();
});



// 注册路由
app.use(router.routes());
// 自动丰富 response 相应头，当未设置响应状态(status)的时候自动设置，在所有路由中间件最后设置(全局，推荐)，也可以设置具体某一个路由（局部），例如：router.get('/index', router.allowedMethods()); 这相当于当访问 /index 时才设置
app.use(router.allowedMethods());

app.listen(9003)

// config.port为自定义端口
// https.createServer(options, app.callback()).listen(9003, (err) => {
//   if (err) {
//     console.log('服务启动出错', err);
//   } else {
//     console.log('https运行在' + 9003 + '端口');
//   }	
// });