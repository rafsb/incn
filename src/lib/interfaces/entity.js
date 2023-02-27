/*---------------------------------------------------------------------------------------------
 * entity
 *--------------------------------------------------------------------------------------------*/

const
md5 = require('md5')
, io = require("../io")
, database = require(`../models/${DB_DRIVER}`)
, classname = require(`./classname`)
, { fw, fObject, fArray, fDate, fTex } = require('../fw')
;;

class entity extends classname {

    uid(x){ if(x) this.id = x; return this.id }

    p(field, x){ if(x!==null&&x!==undefined) this[field] = x; return this[field] }

    import(path){
        if(io.exists(path)) {
            const o = io.jout(path) ;;
            o.filepath_ = path
            o.status_   = o.status_ || EStatus.NOT_SET
            return this.classname().cls.cast(o)
        }
        return false
    }

    static import(src_name) {
        return this.classname().cls.cast().import(src_name)
    }

    static open(path) {
        return this.classname().cls.import(path)
    }

    toObject() {
        return { ... this }
    }

    export(path) {
        const obj = this.toObject() ;;
        if(path) io.jin(path, obj)
        return obj
    }

    static export(path, obj) {
        return this.classname().cls.cast(obj).export(path)
    }

    mime(){
        return new this.constructor(this.export(null))
    }

    set(key, value){
        if(key && value) {
            if(this[key] instanceof Function) return this[key](value)
            else this[key] = value
        }
        return this[key]
    }

    cast(obj){
        return new this.constructor(obj)
    }

    // @override
    validate(){ return true }

    dbconf(conf){

        conf = conf || {};

        const
        classname = conf && conf.classname ? { name: conf.classname, cls: eval(conf.classname) } : this.classname()
        ;;

        return fw.blend({
            db:          DB_NAME
            , container: `${classname.name}s`
            , pk:        classname.cls.cast().pk_ || DB_PK
            , key:       DB_KEY
            , endpoint:  DB_ENDPOINT
        }, conf||{})
    }

    id_builder(){
        if(!this.id) this.id = md5(`${fDate.time()}`)
    }

    constructor(obj={}, pk=null) {
        const date = fDate.cast() ;;
        super(fw.blend({
            status_: EStatus.ACTIVE
            , created_: date.time()
            , created_str_: date.as()
            , modified_: date.time()
            , pk_: DB_PK
            , data_: ''
            , compressed_: false
        }, obj));

        if(pk!=null||pk!=undefined) {
            if(typeof pk != 'object') this[this.pk_] = pk;
            else {
                const k = Object.keys(pk)[0], v = Object.values(pk)[0] ;
                this.pk_ = k
                this[k] = this[k] || v
            }
        } else if(!this[DB_PK]) this[DB_PK] = obj[DB_PK] || 'default';

        if(!this.id) this.id_builder();

        this.data = function(x) {
            if(x) {
                if(typeof x != 'string') try { x = JSON.stringify(x) } catch(e) { x = x.toString() }
                this.data_ = this.compressed_ ? fw.compress(x) : x
                return x
            }
            x = this.compressed_ ? fw.decompress(this.data_) : this.data_
            try { return JSON.parse(x) } catch(e) { return x }
        }

    }

    async save(args) {
        try {

            this.id_builder()

            const
            classname = args && args.classname ? { name: args.classname, cls: eval(args.classname) } : this.classname()
            , conn = classname.cls.dbconf(args)
            ;;

            var
            o = this.export(null)
            , ret = false
            ;;

            if(o && this.validate()) {
                const
                date = new fDate()
                , db = await database.load(conn)
                ;;

                o.status_  = o.status_ || EStatus.ACTIVE
                o.modified_ = date.time()
                o.modified_str_ = date.as()
                if(!o.created_) o.created_ = date.time()
                o.created_str_ = fDate.guess(o.created_).as()

                ret = await db.save(o)
            }
            return ret ? this.classname().cls.cast(ret) : false

        } catch(e){
            if(VERBOSE>1) console.trace(e);
            return false
        }
    }

    static dbconf(conf){

        conf = conf || {};

        const
        classname = this.classname()
        ;;

        return fw.blend({
            db:          DB_NAME
            , container: `${classname.name}`
            , pk:        classname?.cls?.cast()?.pk_ || DB_PK
            , key:       DB_KEY
            , endpoint:  DB_ENDPOINT
        }, conf||{})
    }

    static async conn(conn) {
        conn = (this.classname().cls).dbconf(conn)
        return await database.load(conn)
    }

    static async pipe(conn) {
        return this.classname().cls.conn(conn)
    }

    static cast(obj) {
        return new (this.classname().cls||fObject)(obj)
    }

    static queryfy(params){
        const query_items = new fArray() ;;
        (params.filters||params.filter||[]).forEach(field => {
            if(Array.isArray(field)) {
                const key = field[0] ;;
                if(key) {
                    const value = field[1] ;;
                    if(undefined !== value && null !== value) {
                        const is_str = isNaN(Array.isArray(value)?value[0]:value) ;;
                        const operator = field[2] ? field[2] : '='
                        const is_rx = operator == "//" ;;
                        if(is_rx) {
                            query_items.push(`REGEXMATCH(LOWER(c.${key}), "${fTex.rx(value.toLowerCase(), 4, '\\\\b', false)}")`)
                        } else query_items.push(`c.${key}${operator}${is_str?'"':''}${value}${is_str?'"':''}`)
                    }
                }
            }
        })
        params.order = params.order || []
        return `SELECT * FROM c${query_items.length ? ` WHERE ${ query_items.join(` ${params.junction||"AND"} `) }` : ``} ORDER BY c.${params.order[0]||'_ts'} ${params.order[1]||'DESC'}`
    }

    static async import_from_db(from_cfg, callback, chunk=1000){
        if(from_cfg){
            from_cfg = this.dbconf(from_cfg);
            const
            classtype = this.classname()
            , db = await database.load(to_db)
            , iter = db.iterator(callback, null, chunk, classtype.cls)
            ;;
            if(!callback) callback = (item, i) => {
                console.log(`${classtype.name}::import_from_db => ${from_cfg.db}/${from_cfg.container} | ${fw.fill(i+count, ' ', 12)}`)
                return item
            }

            var count = 0;

            var res;

            do {
                res = await iter.next() ;;
                await this.bulk(res.items);
                count += res.items.length;
            } while(res&&res.hasMoreResults);


        }
    }

    static async export_to_db(to_db, callback, chunkSize=200, filter, conn, force=false){

        if(to_db){

            to_db = this.dbconf(to_db);

            const
            classtype = this.classname()
            ;;

            if(!callback) callback = async (item, i) => {
                info(`${classtype.name}`,`export_to_db`, `${to_db.db}/${to_db.container} | ${fw.fill(i, ' ', 12)}`);
                return item
            }

            const
			classname = this.classname()
            , overall = await classname.cls.count(null, conn)
            , exists = !force ? Object.values(await (await classname.cls.pipe(to_db)).query(`SELECT c.id FROM c`)).map(i => i.id) : []
            , pk = classname.cls.cast().pk_
            , pkls = await (await classname.cls.pipe(conn)).query(`SELECT DISTINCT c.${pk} FROM c ORDER BY c.${pk} ASC`)
            , db = await database.load(classname.cls.dbconf(to_db))
            , collen = parseInt(process.stdout.columns * .7)
			;;

            console.log(`items affected: ${fw.nerdify(overall)}/${fw.nerdify(pkls.length)}pks with force-mode ${force?'ON' : 'OFF'}`)

            var counter = 0 ;;
            fw.gauge(0, fw.fill(`progress: 0/${overall} ${classname.name}/${pk}`, ' ', collen))
			for(let j in pkls) {
				const
				pk = Object.values(pkls[j])[0]
				;;
				if(pk!==undefined && pk!==null){
					const iter = await classname.cls.iterator({
                        query: entity.build_select_query(filter)
                        , callback
                        , chunkSize
                        , pk
                    }, conn) ;;
					var res;
					do {
						res = await iter.next();
                        if(res?.items?.length) {
                            counter += res.items.length;
                            fw.gauge(counter/overall, fw.fill(`progress: ${counter}/${overall} ${classname.name}/${pk}`, ' ', collen))
                            const final = [] ;;
                            for(let i in res.items) if(force || !(exists.indexOf(res.items[i].id)+1)) final.push(res.items[i]);
                            if(final.length) await db.bulk(final)
                        }
					} while(res?.hasMoreResults)
				}
			}

            fw.gauge(1, fw.fill(`progress: ${counter}/${overall} ${classname.name}`, ' ', collen))
            console.log()
            console.log(`calculating result of migratin...`)
            const migrated = Object.values(await classname.cls.count(to_db)) ;;
            console.log(`for ${classname.name}, ${fw.nerdify(migrated)} were found on destiny!`)
            return
        }

    }

    static async freeze_container(callback, conn, chunkSize=500){

        const
        classtype = this.classname()
        ;;

        conn = fw.blend(this.dbconf(conn), { container: `Frozen${classtype.name}s` });

        if(!callback) callback = (item, i) => {
            out(`${classtype.name}`, `freezing`, `${conn.db}/${conn.container} | ${fw.fill(item.id, ' ', 4)}`);
            return item
        };

        if(IO_MODE){

            const
            o_folder = `var/db/${conn.db}/${classtype.name}s`
            , i_folder = `var/db/${conn.db}/${conn.container}`
            , ls = io.files(o_folder)
            ;;

            for(let i in ls) {
                var item = io.jout(`${o_folder}/${ls[i]}`);
                item = callback(item, i);
                io.jin(`${i_folder}/${ls[i]}`, item);
                await fw.sleep(20)
            }

        } else {

            const
            iter = await this.iterator({ callback, chunkSize })
            , db = await database.load(conn)
            ;;

            var res;

            do {
                res = await iter.next();
                if(res && res.items && res.items.length) await db.bulk(res.items);
            } while(res && res.hasMoreResults);


        }

    }

    static async list(order, dir, conn) {

        conn = this.dbconf(conn);

        const
        classtype = this.classname()
        ;;

        var items = [];

        if(IO_MODE) items = io.files(`var/db/${conn.db}/${conn.container}`).extract(item => io.jout(`var/db/${conn.db}/${conn.container}/${item}`));
        else {
            const db = await database.load(conn) ;;
            if(db) items = await db.query(entity.build_select_query(null, order, dir))
            else {
                fail(this.classname().name, 'list', 'creating database object')
                items = []
            }
        }
        return items && items.length ? items.map(item => classtype.cls.cast(item)) : new fArray()
    }

    static async count(filter, conn) {

        conn = this.dbconf(conn);

        var res = 0 ;;

        if(IO_MODE) res = io.files(`var/db/${conn.db}/${conn.container}`).length;
        else {
            const db = await database.load(conn) ;;
            filter = entity.build_select_query(filter).replace(`SELECT *`, `SELECT COUNT(1)`);
            res = db ? await db.count(filter) : 0
        }
        return res
    }

    static async ls(order, dir, conn) {
        return await this.list(order, dir, conn)
    }

    static async load(id, pk, conn) {

        conn = this.dbconf(conn);

        var item = null;

        if(IO_MODE) {
            const path = `var/db/${conn.db}/${conn.container}/${id}` ;;
            item = io.exists(path) ? io.jout(path) : null;
        } else {
            const
            db = await database.load(conn)
            , filter = {id}
            ;;
            if(pk) filter[conn.pk] = pk ;
            if(db) {
                item = (await db.query(entity.build_select_query(filter)))[0]
            } else err(this.classname().name, `load`, 'the database object is not present')
        }
        return item && !item.isNull() ? this.classname().cls.cast(item) : null
    }

    async drop(conn){

        warn(this.classname().name, 'drop', this.id);

        conn = this.dbconf(conn);
        var item = null;

        if(IO_MODE) {
            const path = `var/db/${conn.db}/${conn.container}/${this.id}` ;;
            item = io.exists(path) ? io.rm(path) : null
        } else {
            const db = await database.load(conn) ;;
            try {
                item = (await db.container.item(this.id, this[this.pk_]).delete()).resource && 1
            } catch(e) {
                err(this.classname().name, `drop`, e.toString());
                if(VERBOSE>3) console.trace(e)
            }
        }
        return item
    }

    static async drop(id, pk, conn) {

        warn(this.classname().name, 'drop', id + '/static');

        conn = this.dbconf(conn);
        var item = null;

        if(IO_MODE) {
            const path = `var/db/${conn.db}/${conn.container}/${id}` ;;
            item = io.exists(path) ? io.rm(path) : null
        } else {
            const db = await database.load(conn) ;;
            try {
                item = (await db.container.item(id, pk).delete()).resource && 1
            } catch(e) {
                err(this.classname().name, `drop/static`, e.toString());
                if(VERBOSE>3) console.trace(e)
                item = false
            }
        }
        return item
    }

    static async filter(filter, order, dir, conn) {

        conn = this.dbconf(conn);
        const classtype = this.classname() ;;

        var items = [];
        if(IO_MODE) items = io.files(`var/db/${conn.db}/${conn.database}/`).extract(item => {
            item = io.jout(`var/db/${conn.db}/${conn.database}/${item}`);
            if(!item) return null;
            var pass = true;
            fObject.cast(filter).each(f => { if(item[f.key] != f.value) pass = false })
            return pass ? classtype.cls.cast(item) : null
        }); else {
            try {
                const db = await database.load(conn) ;;
                items = await db.query(entity.build_select_query(filter, order, dir))
            } catch(e) {
                err(classtype.name, "filter", e.toString())
                if(VERBOSE > 2) console.trace(e)
                items = []
            }
        }
        return items && items.length ? items.extract(item => classtype.cls.cast(item)) : []
    }

    static async list_by_status(status_=EStatus.ACTIVE, conn) {
        return await this.filter({status_}, conn)
    }

    static async list_actives(conn) {
        return await this.list_by_status(EStatus.ACTIVE, conn)
    }

    static async lsa(conn) {
        return await this.list_by_status(EStatus.ACTIVE, conn)
    }

    static async list_by_type(type_=ESourceTypes.NOT_SET, conn) {
        return await this.filter({type_}, conn)
    }

    static async iterator(config={}, conn) {

        conn = this.dbconf(conn);

        const
        db = await database.load(conn)
        ;;

        return db.iterator(
            config.callback ? config.callback : null
            , config.query ? config.query : entity.build_select_query(config.filter || null, config.order || '_ts', config.direction || 'desc')
            , config.chunkSize ? config.chunkSize : null
            , this.classname().cls
            , config && config.pk ? config.pk : null
        )
    }

    static async bulk(items, conn) {

        conn = this.dbconf(conn);
        var classtype = this.classname(), res = 0;

        if(IO_MODE) {
            for(let i in items) {
                const it = classtype.cls.cast(items[i]);
                if(it.validate()) {
                    const item_path = `var/db/${conn.db}/${conn.container}/${it.id}`;
                    if(io.exists(item_path)) it = classname.cls.cast(fw.blend(io.jout(item_path)||{}, it));
                    res = io.jin(item_path, it);
                    await fw.sleep(20);
                } else LOG(`${conn.db}::${conn.container}::${it.id} not allowed to be saved`);
            }
         } else {
            try {
                const
                db = await database.load(conn)
                ;;
                res = await db.bulk(items)
            } catch(e) {
                err(this.classname().name, 'bulk', e.toString())
                if(VERBOSE>3) console.trace(e)
            }
        }
        return res
    }

    // @override
    static async sync_items(items, conn) {

        conn = this.dbconf(conn) ;;
        var classtype = this.classname(), res = new fArray();

        if(IO_MODE) {
            items.map(it => {
                const item_path = `var/db/${conn.db}/${conn.container}/${it}`;
                if(io.exists(item_path)) res.push(classtype.cls.cast(io.jout(item_path)));
            })
        } else {
            const db = await database.load(conn) ;;
            res = await db.itemlist(items, classtype.cls)
        }

        return res
    }

}

module.exports = entity