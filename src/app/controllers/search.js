const fw = require('../../lib/fw');

/*---------------------------------------------------------------------------------------------
 * search
 *--------------------------------------------------------------------------------------------*/
const
initiator = require('../interfaces/initiator')
, text    = require('../../lib/utils/ftext')
, date    = require('../../lib/utils/fdate')
, cache   = require('../../lib/utils/fcache')
, io      = require('../../lib/utils/io')
, axios   = require(`axios`)
, cheerio = require('cheerio')
, md5     = require(`md5`)
, rss     = new (require('rss-parser'))()
;;

/**
 * GoogleNews/Bing -> Search class
 */
module.exports = class search extends initiator {

    static GOOGLE_URI = text.cast("https://news.google.com/rss/search?q={{query}}&hl=pt-BR&gl=BR&ceid=BR:pt-419")
    static BING_URI = text.cast("https://api.bing.microsoft.com/v7.0/search/?q={{query}}&count={{count}}&offset={{offset}}")

    static async simplify_page(link, tags) {
        tags = tags || [
            "head", "header", "footer", "aside", "nav", "iframe", "img", "svg", "script", "noscript"
            , "style", "form", "input", "select", "textarea", "button"
        ]
        let res ;;
        if(link) {
            try {
                const $ = cheerio.load((await (await fetch(link)).text()).replace('>', '> ').replace(/<[\/]{0,1}br[\s]{0,4}[\/]{0,1}>/gui, " .<br/>\n ")) ;;
                $(tags.join(',')).each((_,e) => $(e).remove())
                res = $("body").text().replace(/(\\n|\\t|\n|\t|\s)+/g, ` `).trim()
            } catch(e) {
                if(VERBOSE>2) console.trace(e)
            }
        }
        return res
    }

    static async google(data) {

        const
        q = typeof data == `string` ? data : (data?.q || false) ;;
        let res = { } ;;
        if(q) {
            const cache_name = `search-${md5(q)}` ;;

            let final = cache.get(cache_name) ;;
            if(final) return final

            const
            query = search.GOOGLE_URI.prepare({ query: encodeURI(q) })
            , req = await fetch(query, { "method": "GET" })
            ;;

            final = await req.text()
            data = await rss.parseString(final)

            for(let i in data.items) {
                let link ;;
                try { link = (await (await fetch(data.items[i].link)).text()).match(/data-n-au=['"`](.*?)['"`]/m)[1] } catch(e) {}
                if(link) {
                    const tmp = cache.get(`search-link-${md5(link)}`) ;;
                    data.items[i].document = tmp ? tmp : { content: await search.simplify_page(link), link }
                    cache.set(`search-link-${md5(link)}`, data.items[i].document, 1000 * 60 * 60 * 24 * 7)
                }
            }

            res = { query, data, q }
            cache.set(cache_name, res, 1000 * 60 * 60 * 24)
        }

        return res
    }

    // params = {
    //     count: 10,
    //     offset: 0
    // }

    // static async init() {
    //     bing.rec(0, 10, searches, arr)
    //     // bing.google();
    // }

    static async bing(q, count=10, depth=10) {

        const tmp = cache.get(`bing-${md5(q)}`) ;;
        if (tmp) return tmp

        const res = { q, data: [] } ;;

        async function bing_fetch(offset) {
            const
            uri = search.BING_URI.prepare({ query: encodeURIComponent(q), count, offset })
            , cache_name = `bing-${md5(uri)}`
            , req = cache.get(cache_name) || await (await fetch(uri, {
                method: 'GET'
                , headers: { 'Ocp-Apim-Subscription-Key': process.env.BING_SECRET }
            })).json()
            ;;

            cache.set(cache_name, req, 1000 * 60 * 60 * 24 * 7)
            req?.webPages?.value?.forEach(element => res.data.push(element))
        }

        for(let i=0;i<depth;i++) await bing_fetch(i*count)

        cache.set(`bing-${md5(q)}`, res, 1000 * 60 * 60 * 24)

        return res

    }

}
