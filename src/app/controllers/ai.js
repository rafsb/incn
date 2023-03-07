const
io = require("../../lib/utils/fio")
// , { Configuration, OpenAIApi } = require("openai")
, cache = require("../../lib/utils/fcache")
, date = require("../../lib/utils/fdate")
// , openai = new OpenAIApi(new Configuration({ apiKey: process.env.AI_SECRET }))
;;

module.exports = class ai {

    static async models(req) {
        if(req?.log) req.log({ stream: `fetching list of models from server`, progress:.2 })
        let res = cache.get('ai-models')?.data ;;
        if(!res) {
            res = await (await fetch("https://api.openai.com/v1/models", {
                method: 'GET'
                , withCredentials: true
                , credentials: 'include'
                , headers: { 'Authorization' : `Bearer ${process.env.AI_SECRET}`, 'Content-Type': 'application/json' }
            })).json()
            cache.set('ai-models', res, 1000 * 60 * 60 * 24)
        }
        if(req?.log) req.log({ stream: `fetched done`, progress:1 })
        return res
    }

    // curl https://api.openai.com/v1/completions \
    // -H "Content-Type: application/json" \
    // -H "Authorization: Bearer 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" \
    // -d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}'

    static async prompt(req) {
        let now = date.time() ;;
        const history = cache.get(req.device)?.data || {} ;;
        if(!req?.data?.messages?.length && !req?.data?.prompt) req.response = "invalid request. missing prompt!"
        else {
            history[now] = req.data.messages || req.data.prompt
            // if(req.log) req.log({ stream: `\n` + req.data.messages?.map(i => i.content).join('\n') || req.data.prompt, progress:.2 })
            if(req.log) req.log({ stream: `\n` + req.data.prompt, progress:.2 })
            try {
                console.log(JSON.stringify(req.data))
                const response = await fetch("https://api.openai.com/v1/completions", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer `+ process.env.AI_SECRET
                    },
                    body: JSON.stringify({
                        model         : req.data.model          || 'text-davinci-003'
                        // , messages    : req.data?.messages || null
                        , prompt      : req.data?.prompt        || 'tell me to ask you something in a funny way'
                        , temperature : req.data.temperature    || .2
                        , max_tokens  : req.data.max_tokens     || 100
                        , top_p       : req.data.top_p          || 1
                        , n           : req.data.n              || 1
                        , presence_penalty  : req.data.presence_penalty  || 0
                        , frequency_penalty : req.data.frequency_penalty || 0
                    })
                }) ;;
                req.response = await response.json() ;;
            } catch(e) {
                if(VERBOSE) {
                    try { io.log(JSON.stringify(e.toJSON(), null, 4), 'ai') } catch(e) {}
                    console.trace(e)
                }
                req.response = 'err: ' + e.status + ' <- code'
                req.error = e
            }
        }
        now = date.time()
        history[date.time()] = req.response
        if(req.log) req.log({ stream: `a: ` + (req.response?.choices ? req.response.choices[0]?.text?.slice(0,40) : "!"), progress:1 })
        cache.set(req.device, history, 1000 * 60 * 60 * 24 * 7)
        console.log(req.response)
        return req

    }

}