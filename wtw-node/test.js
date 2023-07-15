const HttpsProxyAgent = require('https-proxy-agent');
const { default: _fetch } = require("node-fetch");


import('chatgpt').then(({ChatGPTAPI}) => {
    async function example() {
        const api = new ChatGPTAPI({
          apiKey: "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",
          fetch: (input, init) => {
            console.log("=====", input, init)
            init.redirect =  'follow'
            init.agent =  new HttpsProxyAgent("http://" + "127.0.0.1" + ":" + 1080) 
            return _fetch(input, init)
          }
        })
        const res = await api.sendMessage('Hello World!')
        console.log(res.text)
      }
    example()
})

