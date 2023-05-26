/*---------------------------------------------------------------------------------------------
 * search
 *--------------------------------------------------------------------------------------------*/
const
fw          = require('../../lib/fw')
, initiator = require('../interfaces/initiator')
, text      = require('../../lib/utils/ftext')
;;

/**
 * GoogleNews/Bing -> Search class
 */
module.exports = class summarize extends initiator {

    static async init(args) {
        console.log(args.cloud)
        args.log&&args.log({ stream: `initializing summarization for ${text.nerdify(args.text.length/4)} tokens`, progress:0 })
        args.text = text.summarize(args.text, args.tokens||2048, null, null, args.cloud || null)
        args.log&&args.log({ stream: 'finalized', progress:1 })
        return args
    }

}