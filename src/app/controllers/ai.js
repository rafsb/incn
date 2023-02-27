const
{ Configuration, OpenAIApi } = require("openai")
, io = require("../../lib/utils/io")
, openai = new OpenAIApi(new Configuration({ apiKey: process.env.AI_SECRET }))
;;

module.exports = class ai {

    static async quest(prompt) {

        try {
            const conf = {
                model               : `text-babbage-001` // `text-davinci-003`
                , temperature       : 0.5
                , prompt
                // , max_tokens        : 100
                // , top_p             : 1
                // , frequency_penalty : 0
                // , presence_penalty  : 0
                // , stop              : [ `\n` ]
            } ;;
            prompt = (await openai.createCompletion(conf))?.data || "error"
            console.log(conf, prompt)
            io.jin('var/ai-result.json', prompt)
            return prompt

        } catch(e) {
            console.log(e.toString())
            return e || { error: e.code + ' <- code' }
        }

    }

}