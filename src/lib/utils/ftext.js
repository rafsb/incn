const
zlib = require('zlib')
, crypto = require('crypto')
, io = require('./fio')
;;

module.exports = class fText {

    static stopwords = Array.from(new Set(io.read(`etc/dicts/${process.env.APP_LOCALE}/stopwords.txt`).split(/\s+/gui)))

	static flex = [ 's', '(a|á|à|ã)s', '(e|é|ê)s', '(i|í)s', '(o|ó|ô|õ)s', '(u|ú)s'	]

    static phrase_boundaries = "[§|•.;?!\\n]"

    rx(wrule=2, b="\\b", asrx=true, flags="guim"){
        const
        midrule = ".{1," + wrule + "}"
        , replaced = '(' + this.value
            .replace(/[^-'0-9a-zÀ-ÿ ]/gui, " ")
            .replace(/\s+/giu, " ")
            .trim()
            .replace(/(a|á|à|ã)/giu, "(a|á|à|ã)")
            .replace(/(e|é|ê)/giu,	 "(e|é|ê)")
            .replace(/(i|í)/giu,	 "(i|í)")
            .replace(/(o|ó|ô|õ)/giu, "(o|ó|ô|õ)")
            .replace(/(u|ú)/giu,	 "(u|ú)")
            .replace(/(c|ç)/giu,	 "(c|ç)")
            .replace(/\s+/giu, `(${fText.flex.join('|')}){0,})${midrule}(`) + `(${fText.flex.join('|')}){0,})(${b}|\s+)`
		;;
        // console.log('\n', replaced, '\n')
        return asrx ? new RegExp(replaced, flags) : replaced
    }

    clear() {
        return this.value.toLowerCase().replace(/<[^>]*>/g, "").replace(/[^0-9a-zÀ-ÿ ]/g, '').replace(/\s+/gui, ' ').trim()
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
        let res = this.value ;;
        obj && Object.keys(obj).map(pattern => {
            let rgx = new RegExp("\\{\\{" + pattern + "\\}\\}", "guim") ;;
            res = res.replace(rgx, obj[pattern])
        })
        return res
    }

    sanitize(){
        return encodeURIComponent(this.value).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+')
    }

    sanitized_compare(w) {
        return this.rx().test(w.replace(/\s+/gi, ' ').trim())
    }

    words_frequancy(word_threshold=1) {

        const
        text = this.value.replace()
        , cleanText = text.replace(/[^0-9a-zA-ZÀ-ÿ]/g, ' ')
        , words = cleanText.split(/\s+/)
        , freqMap = {}
        , stops = fText.stopwords.join(' ').toLowerCase()
        ;;

        words.forEach(word => {
            if(word.length > word_threshold && isNaN(word) && !stops.match(fText.rx(word.toLowerCase()))) {
                if (!freqMap[word.toLowerCase()]) freqMap[word.toLowerCase()] = 1
                freqMap[word.toLowerCase()]++
                if(word[0].match(/[A-Z]/g)) freqMap[word.toLowerCase()]++
            }
        })

        return Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]).slice(0, this.frequancy_tokens);
    }

    summarize(maxtokens, wordthreshold, sentensethreshold, advanced_query) {

        if(maxtokens) this.maxTokens = maxtokens
        if(sentensethreshold) this.sentence_tokens = sentensethreshold

        const
        text = this.value
        , relevantWords = this.words_frequancy(wordthreshold)
        , sentences = text.split(new RegExp(fText.phrase_boundaries)).map(s => fText.clear(s)).filter(i => i)
        , scores = {}
        , maxTokens = this.maxTokens
        ;;

        sentences.forEach(sentence => {
            if(!advanced_query || fText.cast(sentence).advanced_query(advanced_query)) {
                const words = sentence.split(/\W+/).filter(i => i) ;;
                if(words.length >= 16 && words.length <= 32) {
                    let count = 0 ;;
                    words.forEach(word => { if(relevantWords.join(' ').match(fText.rx(word))) count += 1 + (relevantWords.length - relevantWords.indexOf(word)) / relevantWords.length })//count++ })
                    scores[sentence] = count // / Math.max(24, words.length)
                }
            }
        })

        const sortedSentences = Object.keys(scores).sort((a, b) => scores[b] - scores[a])

        let reached = 0 ;;
        return sortedSentences.map(sentence => {
            sentence = sentence
            const len = sentence.split(/\W+/g).length ;;
            if(len > this.sentence_tokens) {
                reached += len
                if(reached < maxTokens) return sentence
            }
        }).filter(i => i).join('\n')

    }

    advanced_query(query){

        let
        v = this.value
        , pass = true
        ;;

        query.match(/(-\w*(\s+|\b))/gmi)?.forEach(n => {
            query = query.replace(n, '')
            if(v.match(fText.rx(n.slice(1)))) pass = false
        })

        if(pass && query.trim()) {

            query.split(/OR|AND|\(|\)|\||&/g).filter(i=>i).forEach(w => {
                if(v.match(fText.cast(w).rx())) query = query.replace(fText.rx(w), '1')
                else query = query.replace(fText.rx(w), '0')
            })

            try { pass = true && eval(query.replaceAll('AND', '&&').replaceAll('OR', '||')) } catch(e) {
                if(VERBOSE>3) console.trace(e)
                pass=false
            }

        }

        return pass

    }

    toString(encode='utf-8') {
        return this.value.toString(encode)
    }

    valueOf() {
        return this.value
    }

    constructor(value) {
        this.value            = value || ""
        this.maxTokens        = 3200
        this.frequancy_tokens = 32
        this.sentence_tokens  = 10
    }

    static cast(str) { return new fText(str) }

    static rx(str, wrule, b, asrx, flags) {  return (new fText(str)).rx(wrule, b, asrx, flags) }

    static clear(str) { return (new fText(str)).clear() }

    static compress(str) { return (new fText(str)).compress() }

    static decompress(str) { return (new fText(str)).decompress() }

    static encrypt(str) { return (new fText(str)).encrypt() }

    static decrypt(str) { return (new fText(str)).decrypt() }

    static fill(str, char, len, dir) { return (new fText(str)).fill(char, len, dir) }

    static prepare(str, obj) { return (new fText(str)).prepare(obj) }

    static sanitize(str) { return (new fText(str)).sanitize() }

    static sanitized_compare(str1, str2) { return (new fText(str1)).sanitized_compare(str2) }

    static advanced_query(query, str) { return (new fText(str)).advanced_query(query) }

    static summarize(str, ns, wt, st, wc) { return (new fText(str)).summarize(ns, wt, st, wc) }

    static json(o) {
        let res = null ;;
        try {
            if(typeof o != "string") res = JSON.stringify(o, null, 4)
            else res = JSON.parse(o);
        } catch(e) { console.error(e); }
        return res;
    }

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