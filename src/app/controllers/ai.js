/*---------------------------------------------------------------------------------------------
 * AI
 *--------------------------------------------------------------------------------------------*/

const
io = require("../../lib/utils/fio")
, cache = require("../../lib/utils/fcache").load('ai')
, axios = require('axios')
;;

module.exports = class ai {

    static async models(req) {
        if(req?.log) req.log({ stream: `fetching list of models from server`, progress:.2 })
        let res = cache.get('ai-models') ;;
        if(!res) {
            res = (await axios.get("https://api.openai.com/v1/models", {
                withCredentials: true
                , credentials: 'include'
                , headers: { 'Authorization' : `Bearer ${process.env.AI_SECRET}`, 'Content-Type': 'application/json' }
            })).data
            cache.set('ai-models', res, 1000 * 60 * 60 * 24)
        }
        if(req?.log) req.log({ stream: `fetched done`, progress:1 })
        return res
    }

    static async chat(req) {
        if(!req?.data?.messages?.length) req.response = "invalid request. missing messages!"
        else {
            if(req.log) req.log({ stream: `\n` + req.data.messages?.map(i => i.role + ': ' + i.content).join('\n') || "", progress:.2 })
            try {
                const response = (await axios.post("https://api.openai.com/v1/chat/completions", {
                    model               : req.data.model             || 'gpt-3.5-turbo'
                    , messages          : req.data.messages          || [{ role: "system", content: "you are a helpful assistant" }, { role: "user", content: "zzz" }]
                    , temperature       : req.data.temperature       || 1
                    , top_p             : req.data.top_p             || .1
                    , n                 : req.data.n                 || 1
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer `+ process.env.AI_SECRET
                    }
                })).data ;;

                if(req.log) req.log({ progress:.6 })
                req.response = response
                if(response.error) try {
                    if(VERBOSE>3) console.log(response.error)
                    io.log(JSON.stringify(response.error, null, 4), 'ai')
                } catch(e) {}
            } catch(e) {
                if(VERBOSE) {
                    try { io.log(JSON.stringify(e.toJSON(), null, 4), 'ai') } catch(e) {}
                    console.trace(e)
                }
                req.response = 'err: ' + e.status + ' <- code'
                req.error = e
            }
        }
        if(req.log){
            req.response?.choices?.forEach((ch, i) => req.log({ stream: `        ${i+1} - ${ch.message.content}` }))
            req.log({ progress: 1 })
        }
        return req

    }

}