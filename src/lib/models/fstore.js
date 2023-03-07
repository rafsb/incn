const
fio = require("../utils/fio")
, fdate  = require("../utils/fdate")
;;

class fstore {

    static db_name = global.DB_NAME || `store_db`

    static cast(db_name) {
        return new fstore(db_name)
    }

    static log() {
        if(VERBOSE) console.log( ... arguments)
    }

    constructor(db_name){
        this.db_name = db_name || fstore.db_name
        this.load()
    }

    save() {
        return fio.jin("var/db/" + this.db_name, this.db)
    }

    load(db_name) {
        if(db_name) this.db_name = db_name
        if(!fio.exists("var/db/" + this.db_name)) fio.jin("var/db/" + this.db_name, { ts: fdate.time() });
        this.db = fio.jout("var/db/" + this.db_name) ;;
        return this
    }

    createdb(db_name) {
        return this.load(db_name)
    }

    changedb(db_name) {
        if(db_name) this.load(db_name)
        return this
    }

    persist(name) {
        if(name) this.db_name = name
        return this.save()
    }

    log() {
        if(VERBOSE) console.log.apply(console, ... arguments);
    }

    all(fn) {
        const all = Object.values(this.db) ;;
        if (!fn) return all
        try { fn(null, all) } catch(e){ fn(e, null) }
    }

    set(id, data, fn) {
        this.db[id] = data
        this.persist()
        if (fn) fn.apply();
        else return this
    }

    touch(id, data, fn) {
        return this.set(id, data, fn)
    }

    get(id, fn) {
        id = 'undefined' === typeof this.db[id] ? null : this.db[id]
        if (!fn) return id
        try { fn(null, id) } catch(e) { fn(e, null) }
    }

    destroy(id, fn) {
        delete this.db[id];
        this.persist()
        if(fn) fn()
    }

    length(fn) {
        const len = Object.keys(this.db).length
        if(!fn) return len
        try { fn(null, len) } catch(e) { fn(e, null) }
    }

    clear(fn, persist = false) {
        this.db = {}
        if(persist) this.persist()
        if(fn) fn()
    }

    reload(options) {
        return new fstore(options)
    }

}

module.exports = fstore;