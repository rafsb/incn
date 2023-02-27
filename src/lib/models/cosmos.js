/*---------------------------------------------------------------------------------------------
 * Cosmos
 *--------------------------------------------------------------------------------------------*/

const
START = true

// LIBS
, https  = require('https')
, Cosmos = require('@azure/cosmos').CosmosClient
, { Spum, FObject, FArray, fDate } = require('../spum')

// MACROS
, CosmosDB      = conf => new Cosmos({
    endpoint    : conf && conf.endpoint ? conf.endpoint : DB_ENDPOINT
    , key       : conf && conf.key ? conf.key : DB_KEY
    , agent     : new https.Agent({ rejectUnauthorized: false })
    , primaryConnectionString: `AccountEndpoint=${conf && conf.endpoint ? conf.endpoint : DB_ENDPOINT};AccountKey=${conf && conf.key ? conf.key : DB_KEY}`
})

;;

module.exports = class Cosmos_Traits {

    client(){
        return this._CosmosClient
    }

    async item(item_id, pk) {
        try {
            if(!item_id) return Fail('Cosmos', 'item', 'item_id is required');
            const { resource: item } = await this.container.item(item_id, pk||null).read()
            return item;
        } catch(e) {
            Err('Cosmos', 'itemlist', e.toString());
            if(VERBOSE>3) console.trace(e);
            return FArray.cast()
        }
    }

    async itemlist(item_ids, type=FObject) {
        try {
            if(!Array.isArray(item_ids)) item_ids = [item_ids];
            return await (await this.query(`SELECT * FROM c WHERE c.id IN ("${item_ids.join('","')}")`, type))
        } catch(e) {
            Err('Cosmos', 'itemlist', e.toString());
            if(VERBOSE>3) console.trace(e);
            return FArray.cast()
        }d
    }

    async count(filter){
        try {
            const res = await this.query(filter||'SELECT count(1) FROM c') ;;
            return res && res[0] && res[0]['$1'] ? res[0]['$1'] : 0;
        } catch(e) {
            err('Cosmos', 'count', e.toString());
            if(VERBOSE>3) console.trace(e);
            return 0
        }

    }

    async query(q, type=FObject, cfg) {
        try {
            const { resources } = await this.container.items.query(q, cfg).fetchAll()
            return FArray.cast(resources.map(i => type.cast(i)))
        } catch(e) {
            Err('Cosmos', 'query', e.toString());
            if(VERBOSE>3) console.trace(e);
            return FArray.cast()
        }
    }

    async save(item, tryes=3) {
        try{
            if(!item||!tryes) return false;
            if(!this.container) return Fail('Cosmos', 'save', 'no container given');
            item.modified_ = fDate.time();
            item = (await this.container.items.upsert(app.blend({
                id: item.id || (md5(fDate.now() + (item.name_||'')))
                , created_: fDate.now().getTime()
            }, item))).resource;
            return item || false
        } catch(e) {
            err('Cosmos', 'save', e.toString());
            if(VERBOSE>3) console.trace(e);
            const me = this ;;
            return new Promise(pass => {
                Info(`Cosmos`, `save`, `retrying, ${tryes} tryes left for ${item.id}`);
                setTimeout(async _ => pass(await me.save(item, --tryes)), DB_WAIT_TIME)
            })
        }
    }

    async bulk(items, counter=-1){

        const
        me = this
        , now = new fDate()
        ;;

        var ret = new FArray(), counter = counter==-1 ? DB_N_TRYIES : counter ;;

        if(DB_LOCK >= DB_N_PROCESS) {
            if(counter) return new Promise(pass => setTimeout(async _ => pass(await me.bulk(items, counter-1)), DB_WAIT_TIME));
            else return Fail(`Cosmos`, `bulk`, `max time exeeded`)
        }

        try {
            DB_LOCK++;
            if(VERBOSE>3) Info(`DATABSE`, ` LOCK `, `(at ${now.as('Y/m/d h:i:s')})`, ETerminalColors.BG_WHITE);
            for(let i=0; i<items.length; i++) {
                const tmp = await this.save(items[i]) ;;
                ret[i] = tmp
            }
            DB_LOCK = Math.max(0, DB_LOCK-1);
            if(VERBOSE>3) Info(`DATABSE`, ` RELEASE `, `(elapsed time: ${parseInt((fDate.time() - now.time())/1000).toFixed(1)}s)`, ETerminalColors.BG_WHITE);
        } catch(e) {
            DB_LOCK = Math.max(0, DB_LOCK-1);
            if(VERBOSE>3) Warn(`Cosmos', 'bulk`, `DB_LOCK released ${DB_LOCK}`);
            if(VERBOSE>3) console.trace(e);
        }

        return ret
    }

    async next(){

        try{

            const cfg = { maxItemCount: this._Iterator_Chunksize } ;;
            if(this._Iterator_PartitionKey) cfg.partitionKey = this._Iterator_PartitionKey;
            if(this.hasMoreResults) cfg.continuationToken = this.continuationToken;

            var
            ls = await this.container.items.query(this._Iterator_Query, {...cfg}).fetchNext()
            ;;

            this.hasMoreResults = ls.hasMoreResults && ls.continuationToken;
            this.continuationToken = ls.continuationToken;

            const
            items = FObject.cast()
            ;;

            for(let i in ls.resources) {
                // console.log(this._Iterator_Class.cast(ls.resources[i]).uid()); continue;
                var item = this._Iterator_Class.cast(ls.resources[i]);
                const item_id = item.uid()+item[item.partition_] ;;
                items[item_id] = this._Iterator_Callback ? this._Iterator_Callback(item, i * 1 + this._Iterator_Counter, this._Iterator_Step) : item
                if(items[item_id] instanceof Promise) items[item_id] = await items[item_id]
            }
            ;;

            this._Iterator_Counter += items.array().length;
            this._Iterator_Step++;

            return {
                items: items.array().filter(i=>i)
                , hasMoreResults: this.hasMoreResults
                , query: this._Iterator_Query
                , chunkSize: this._Iterator_Chunksize
            }
        } catch (e){
            Err('Cosmos', 'next', e.toString());
            if(VERBOSE>3) console.trace(e);
            return {
                items: FArray.cast()
                , hasMoreResults: false
                , query: this._Iterator_Query
                , chunkSize: this._Iterator_Chunksize
            }
        }
    }

    async list_conteiners() {
        try {
            const { resources } = await this.database.containers.readAll().fetchAll() ;;
            return FArray.cast(resources)
        } catch(e) {
            Err('Cosmos', 'list_containers', e.toString());
            if(VERBOSE>3) console.trace(e);
            return FArray.cast()
        }
    }

    iterator(callback, query='SELECT * FROM c', chunkSize=DB_CHUNK_SIZE, cls=FObject, pk=null){

        if(!callback) callback = i => i;
        this._Iterator_Callback = callback;

        if(!chunkSize || chunkSize<=0) chunkSize = 200;
        this._Iterator_Chunksize = chunkSize;

        if(!query) query = 'SELECT * FROM c';
        this._Iterator_Query = query;
        this._Iterator_Class = cls;

        this._Iterator_Step = 0;
        this._Iterator_Counter = 0;
        if(pk) this._Iterator_PartitionKey = pk;

        return this

    }

    static cast(obj){
        const o = new Cosmos_Traits() ;;
        for(let i in obj) o[i] = obj[i];
        return o
    }


    static async load(conf) {

        try{

            if(typeof conf == 'string') conf = { container: conf };

            const
            _CosmosClient   = CosmosDB(conf)
            , _DatabaseID   = conf?.db        || DB_NAME
            , _ContainerID  = conf?.container || DB_TABLE
            , _PartitionKey = conf?.pk        || DB_PK
            ;;

            const
            database = (await _CosmosClient.databases.createIfNotExists({ id: _DatabaseID })).resource
            , container = (await _CosmosClient.database(database.id).containers.createIfNotExists({
                id: _ContainerID
                , partitionKey: (_PartitionKey[0] == `/` ? `` : `/`) + _PartitionKey
            })).resource
            , res = {
                _DatabaseID
                , _ContainerID
                , _PartitionKey
                , _CosmosClient
                , database:     _CosmosClient.database(database.id)
                , container:    _CosmosClient.database(database.id).container(container.id)
            }
            ;;

            return Cosmos_Traits.cast(res)

        } catch(e) {
            Err(`Cosmos`, `load`, e.toString());
            if(VERBOSE>3) console.trace(e);
            DB_LOCK = 0
        }
    }


}