/*---------------------------------------------------------------------------------------------
 * fCache
 *--------------------------------------------------------------------------------------------*/
const
iostore   = require('../models/iostore')
, date    = require('./fdate')
, fobject = require('./fobject')
;;

/**
 *
 */
const store = iostore.cast('cache') ;;

module.exports = class fCache {

    static get(name) {
        let res ;;
        const cache = store.get(name)
        if(cache){
            if(date.time() < cache.expires) res = fobject.blend({ left: ((cache.expires * 1 - date.time()) / 1000).toFixed(1) + ' secs' }, cache)
            else store.destroy(name)
        }
        return res
    }

    static set(name, data, expires = 1000 * 20) {
        const now = date.time() ;;
        return store.touch(name, { expires: now + expires * 1, ts: now, data })
    }

    static clear() {
        const all = store.all() ;;
        Object.keys(all).forEach(key => {
            if(date.time() >= all[key].expires) store.destroy(key, null, false)
        })
        store.save()
    }

    static destroy(id) {
        return store.destroy(id)
    }

    static clear_all() {
        return store.clear(null, true)
    }

}