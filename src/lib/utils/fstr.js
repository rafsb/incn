
const
zlib = require('zlib')
, crypto = require('crypto')
;;

module.exports = class fstr {

    static preps = [
		, "ao"
		, "aos"
		, "a"
		, "o"
		, "em"
		, "na"
		, "de"
		, "do"
		, "da"
		, "nos"
		, "dum"
		, "desta"
		, "no"
		, "neste"
		, "nisso"
		, "pra"
		, "pro"
	]

	static flex = [
		's'
		, '(a|á|à|ã)s'
		, '(e|é|ê)s'
		, '(i|í)s'
		, '(o|ó|ô|õ)s'
		, '(u|ú)s'
	]

    rx(wrule=2, b="\\b", asrx=true, flags="guim"){
        const
        midrule = ".{1," + wrule + "}"//"([^-'0-9a-zÀ-ÿ]{0,2}[-'0-9a-zÀ-ÿ]+[^-'0-9a-zÀ-ÿ]{0,2}){0," + wrule + "}"
        , replaced = this.value.trim()
            // , replaced = `([ .,?!:;(]{1,}` + w.trim()
            .replace(/[^-'0-9a-zÀ-ÿ ]/gui, " ")
            .replace(/\s+/giu, " ")
            .replace(/(a|á|à|ã)/giu, "(a|á|à|ã)")
            .replace(/(e|é|ê)/giu,	 "(e|é|ê)")
            .replace(/(i|í)/giu,	 "(i|í)")
            .replace(/(o|ó|ô|õ)/giu, "(o|ó|ô|õ)")
            .replace(/(u|ú)/giu,	 "(u|ú)")
            .replace(/(c|ç)/giu,	 "(c|ç)")
            .replace(/\s+/giu, `(${fstr.flex.join('|')}){0,}${b})${midrule}(`) + `(${fstr.flex.join('|')}){0,}${b}`
		;;
        return asrx ? new RegExp(`((^|[ .,?!:;('>\`])${replaced})`, flags) : `((^|[ .,?!:;('>\`])${replaced})`
    }

    clear() {
        return this.value.replace(/[^-0-9a-zÀ-ÿ]/gui, ' ').replace(/\s+/gui, ' ').trim()
    }

    compress(){
        if(!this.is_compressed){
            this.is_compressed = true
            this.value = zlib.deflateSync(Buffer.from(this.value, 'utf-8').toString()).toString('hex')
        }
        return this.value
    }

    decompress(){
        if(this.is_compressed) {
            this.is_compressed = false
            this.value = zlib.inflateSync(new Buffer.from(this.value, 'hex')).toString('utf-8');
        }
        return this.value
    }

    encrypt() {
        if(!this.is_encrypted) {
            this.is_encrypted = true
            const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV) ;;
            this.value = cipher.update(this.value, 'utf8', 'base64')
            this.value += cipher.final('base64')
        }
        return this.value
    }

    decrypt() {
        if(this.is_encrypted){
            this.is_encrypted = false
            const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV) ;;
            this.value = decipher.update(this.value, 'base64', 'utf8')
            this.value += decipher.final('utf8')
        }
        return this.value
    }

    fill(c=' ', l=12, d=1) {
        let str = this.value ;;
        c = !c ? " " : c;
        d = d==0||d==null||d==undefined ? -1 : d;
        while((str).length < Math.abs(l)) str = (d<0?c:"")+str+(d>0?c:"");
        return str
    }

    json() {
        let res = null ;;
        try{ res = JSON.parse(this.value) } catch(e) { console.error(e) }
        return res
    }

    prepare(obj){
        let res = this.value
        obj && Object.keys(obj).map(pattern => {
            let rgx = new RegExp("\\{\\{" + pattern + "\\}\\}", "guim") ;;
            res = res.replace(rgx, obj[pattern])
        })
        return res
    }

    constructor(value="") { this.value = value }
    static cast(value) { return new fstr(value) }
    static rx(value, wrule, b, asrx, flags) {  return (new fstr(value)).rx(wrule, b, asrx, flags) }
    static clear(value) { return (new fstr(value)).clear() }
    static compress(value) { return (new fstr(value)).compress() }
    static decompress(value) { return (new fstr(value)).decompress() }
    static encrypt(value) { return (new fstr(value)).encrypt() }
    static decrypt(value) { return (new fstr(value)).decrypt() }
    static fill(value, char, len, dir) { return (new fstr(value)).fill(char, len, dir) }

    static json(o) {
        let res = null ;;
        try{
            if(typeof o != "string") res = JSON.stringify(o, null, 4)
            else res = JSON.parse(o);
        } catch(e) { console.error(e); }
        return res;
    }

    static prepare(value, obj) { return (new fstr(value)).prepare(obj) }

    static nerdify(n){
        n *= 1
        return n > 1000000000000 ? ((n / 1000000000000).toFixed(1))+"tri" : (
            n > 1000000000 ? ((n / 1000000000).toFixed(1))+"bi" : (
                n > 1000000 ? ((n / 1000000).toFixed(1))+"mi" : (
                    n > 1000 ? ((n / 1000).toFixed(1))+"k" : Math.ceil(n)
                )
            )
        )
    }

    static desnerdify(x){
        let
        n = Number(x.replace(/[^0-9\.]/g,'').replace(',','.'))
        , s = x.replace(/[^a-zA-Z]/g,'');
        switch(s){
            case "tri": n *= 1000000000000; break;
            case "bi" : n *= 1000000000; break;
            case "mi" : n *= 1000000; break;
            case "k"  : n *= 1000; break;
            default   : n *= 1; break;
        }
        return n
    }

}
