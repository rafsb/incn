/*---------------------------------------------------------------------------------------------
 * search
 *--------------------------------------------------------------------------------------------*/
const
fw          = require('../../lib/fw')
, initiator = require('../interfaces/initiator')
, fobj      = require('../../lib/utils/fobject')
, text      = require('../../lib/utils/ftext')
, fdate     = require('../../lib/utils/fdate')
, fcache    = require('../../lib/utils/fcache').load('search')
, io        = require('../../lib/utils/fio')
, axios     = require(`axios`)
, cheerio   = require('cheerio')
, md5       = require(`md5`)
, rss       = new (require('rss-parser'))()
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
        let res = '' ;;
        if(link) {
            try {
                const $ = cheerio.load(((await axios.get(link)).data).replace('>', '> ').replace(/<[\/]{0,1}br[\s]{0,4}[\/]{0,1}>/gui, " . <br/> \n ")) ;;
                $(tags.join(',')).each((_,e) => $(e).remove())
                if($('article,main,section,.content,.main-content').length) $('article,main,section,.content,.main-content').each((_, e) => res += '\n' + $(e).text())
                else res = $("body").text().replace(/(\\n|\\t|\n|\t|\s)+/g, ` `).trim()
            } catch(e) {
                if(VERBOSE>2) console.trace(e)
            }
        }
        return res.replace(/\n+/gui, '\n')
    }

    static async google(req) {

        let log = req?.log ? req.log : (VERBOSE > 2 ? console.log : null) ;;

        log&&log({ progress: .1 })

        if(typeof req == 'string') req = { q: req }
        const q = req.q || req.params[0] ;;

        let res = { } ;;

        if(q) {
            log&&log({ stream: 'searchin on google: ' + q, progress: .2 })

            let query, meta, items = [] ;;

            query = search.GOOGLE_URI.prepare({ query: encodeURI(q) })
            res = (await axios.get(query)).data
            meta = await rss.parseString(res)
            if(meta.items) {
                try { if(req.date) meta.items = meta.items.filter(item => fdate.guess(req.date).time() < fdate.guess(item.pubDate).time()) } catch(e) { console.trace(e) }
                if(req.date) meta.items.forEach(item => console.log(fdate.guess(req.date), fdate.guess(item.pubDate)))
                items = meta?.items?.slice(0, req.len||16) || []
                delete meta.items
            }

            log&&log({ stream: 'fetching & simplifing pages: ', progress: .5 })

            for(let i in items) {
                try {
                    const
                    link = (await axios.get(items[i].link)).data.match(/data-n-au=['"`](.*?)['"`]/m)[1]
                    , cache = fcache.get(`link-${md5(link)}`)
                    ;;
                    log&&log({ stream: '-> ' + link })
                    if(cache) items[i].document = cache
                    else {
                        items[i].document = { content: await search.simplify_page(link), link }
                        fcache.set(`link-${md5(link)}`, items[i].document, 1000 * 60 * 60 * 24 * 7)
                    }
                } catch(e) {}
                log&&log({ progress: .5 + i / (items.length - 1) / 2})
            }
            res = fobj.blend({}, { res, query, items, meta, q })
        }

        log&&log({ progress: 1 })

        return res
    }

    static async bing(req) {

        let log = req?.log ? req.log : (VERBOSE > 2 ? console.log : null) ;;

        log&&log('$gauge{{0}}')

        if(typeof req == 'string') req = { q: req }
        const q = req.q || req.params[0] ;;

        let res = {} ;;

        if(q) {
            log&&log('searchin on bing: ' + q)

            const cache_name = `bing-${md5(q)}` ;;
            let req, query, meta, items = [], cache = req.nocache ? false : fcache.get(cache_name) ;;

            if(cache) {
                log&&log('cache found for: ' + cache_name)
                log&&log('$gauge{{1}}')
                return cache
            }

            fobj.blend(res, { count: 10, depth: 2, gauge: false }, typeof req == 'object' ? req : {}, { q, items: [] }) ;;

            async function bing_fetch(offset) {
                const
                uri = search.BING_URI.prepare({ query: encodeURIComponent(q), count: res.count, offset })
                , cache_name = `link-${md5(uri)}`
                , req = fcache.get(cache_name) || (await axios.get(uri, { headers: { 'Ocp-Apim-Subscription-Key': process.env.BING_SECRET }})).data
                ;;

                if(req.errors && req.errors.length) return 0

                fcache.set(cache_name, req, 1000 * 60 * 60 * 24 * 7)

                if(req?.webPages?.value) for(const element of req?.webPages?.value) {
                    if(element.deepLinks && element.deepLinks.length) for(const i in element.deepLinks) element.deepLinks[i].content = await search.simplify_page(element.deepLinks[i].url)
                    res.items.push(element)
                }

                log&&log(`$gauge{{${offset/(res.count*res.depth)}}}`)

                return res.items.length
            }


            for(let i=0;i<res.depth;i++) {
                if(!(await bing_fetch(i*res.count))) continue
                await fw.delay(1100)
            }

            fcache.set(`bing-${md5(q)}`, res, 1000 * 60 * 60 * 24)
        }

        log&&log(`$gauge{{1}}`)

        return res

    }

}