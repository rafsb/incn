/*---------------------------------------------------------------------------------------------
 * search
 *--------------------------------------------------------------------------------------------*/
const
initiator = require('../interfaces/initiator')

// USER
, fw          = require('../../lib/fw')
, io        = require('../../lib/utils/fio')
, text      = require('../../lib/utils/ftext')
, search    = require('./search')
;;

/**
 * GoogleNews/Bing -> Search class
 */
module.exports = class summarize extends initiator {

    static async init() {
        /**

        telecom (futuro OR tendência OR inovação OR Inteligência Artificial OR startup OR Startups)​

        telecom (economia OR lucro OR sócios OR dividendos OR faturamento OR acionista OR patrimônio OR Bolsa de Valores)

        ​Telecom (5g OR tecnologia OR tecnologias)

        CPI da telefonia

        */

        const searches = [
            // 'telecom (futuro OR tendência OR inovação OR "Inteligência Artificial" OR startup OR Startups)'
            // , 'telecom (economia OR lucro OR sócios OR dividendos OR faturamento OR acionista OR patrimônio OR "Bolsa de Valores")'
            // , "Telecom (5g OR tecnologia OR tecnologias)"
            // ,
            // '"CPI da telefonia"'
            'telecom (Vivo  OR telefonica)'
        ] ;;
        for(const s of searches) {
            const g = io.exists(`var/google-${s}.json`) ? io.jout(`var/google-${s}.json`) : await search.google(s) ;;
            io.jin(`var/google-${s}.json`, g)
            const b = io.exists(`var/bing-${s}.json`) ? io.jout(`var/bing-${s}.json`) : await search.bing(s)
            io.jin(`var/bing-${s}.json`, b)
            let tx = ''
            g.items?.forEach(item => {
                if(item.contentSnippet) tx += item.contentSnippet + '\n'
                if(item.document && item.document.content) tx += item.document.content + '\n\n'
            })
            b.items?.forEach(item => {
                if(item.snippet) tx += item.snippet + '\n'
                if(item.deepLinks && item.deepLinks.length) item.deepLinks.forEach(dlink => dlink.content ? tx += dlink.content + '\n' : null)
                tx += '\n'
            })
            console.log({tx})
            io.write(`var/final-${s}.txt`, tx)
        }
    }


}