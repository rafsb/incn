/*---------------------------------------------------------------------------------------------
 * fbulkpool
 *--------------------------------------------------------------------------------------------*/

module.exports = class fbulkpool extends fObject {

    grant(){ this.add() }

    add(art){

        if(!this._ClassType) return Fail('fbulkpool', 'add', 'Item`s classtype not defined!');

        const
        me = this
        , name = me._ClassType.classname().name
        ;;
        if(me._Fn) clearInterval(me._Fn);
        if(art) me._Arr.push(art);
        if(me._Arr.length >= DB_CHUNK_SIZE) {
            const tmp_arr = me._Arr.splice(0, DB_CHUNK_SIZE) ;;
            me._ClassType.bulk(tmp_arr).then(_ => {
                if(VERBOSE>3) out(`FBookPool<${name}>`, `save`, `${tmp_arr.length}x at ${fDate.cast()}`, ETerminalColors.FT_CYAN)
                if(me._Arr.length) return me.grant()
            })
        }
        me._Fn = setTimeout(async _ => {
            if(me._Arr.length) {
                const tmp_arr = me._Arr.splice(0, DB_CHUNK_SIZE) ;;
                await this._ClassType.bulk(tmp_arr);
                if(VERBOSE>3) out(`FBookPool<${name}>`, `save`, `FORCED! ${tmp_arr.length}x at ${fDate.cast()}`, ETerminalColors.FT_MAGENTA)
                if(me._Arr.length) me.grant()
            }
        }, 10000);
    }

    constructor(cls, clr){
        super({
            _ClassType  : cls
            , _Color    : clr||ETerminalColors.BG_BLUE
            , _Arr      : fArray.cast()
            , _Fn       : false
        })
    }

}