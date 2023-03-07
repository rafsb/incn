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
        args.text = text.summarize(args.text)
        return args
    }

}