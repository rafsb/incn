// /**************************************************************************
//      ___                                             _
//     /  _|_ __ __ _ _ __ ___   _____      _____  _ __| | __
//     | |_| '__/ _` | '_ ` _ \ / _ \ \ /\ / / _ \| '__| |/ /
//     |  _| | | (_| | | | | | |  __/\ V  V / (_) | |  |   <
//     |_| |_|  \__,_|_| |_| |_|\___| \_/\_/ \___/|_|  |_|\_\
//
// ****************************************************************************/
const
DEBUG = false
, SUM = 0
, AVERAGE = 1
, HARMONIC = 2
, TREND = 3
, PROGRESS = 4
, INTERPOLATE = 5
, MAX = 6
, MIN = 7
, RELATIFY = 8
, SMOOTH = 9
, PASSWD_AUTO_HASH = 1
, LOCALE_OFFSET = 1 // pt-br-full=0 pt-br=1 en-us-full=2 en-us=3
, MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
, DAYS = [ "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "dom", "seg", "ter", "qua", "qui", "sex", "sáb", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "sun", "mon", "tue", "wed", "thu", "fri", "sat" ]
, PTBR_FULL = 0
, PTBR = 12
, ENUS_FULL = 24
, ENUS = 36
, TS_MASK = "Y-m-dTh:i:s.000Z"
// , NUMBER            = 0
// , STRING            = 1
, TAG = (n = "div", c, s, t) => app.new(n, c, s)[typeof t == "object" ? "app" : "html"](t || "")
, DIV = (c, s, t) => TAG("div", c, s, t)
, WRAP = (h, c, s) => DIV((c || "") + " -wrapper", s)[h instanceof Object || h instanceof Array ? 'app' : 'html'](h || "")
, IMG = (path = "img/icons/cross.svg", cls = "--self-generated", css = {}) => TAG("img", cls, css).attr({ src: path, role: "img" })
, SVG = (t = "svg", c = "--self-generated", a = { focusable: "false" }, s = {}) => {
    const
    node = document.createElementNS("http://www.w3.org/2000/svg", t)
        .addClass(c)
        .attr(a || {})
        .css(s || {})
        .html(t == "svg" ? "<defs></defs>" : "")
    ;;
    node.attr = function(o, ns) {
        if(o) {
            if(typeof o === "object") Object.keys(o).map(k => this.setAttributeNS(ns, k, o[k]));
            else if(typeof o === "string") return this.getAttribute(o)
        }
        return this
    }
    return node
}
, SPATH = (d, c, a, s) => SVG("path", c, blend({ d: d }, a), s)
, TEXT  = (t,c,s,n="p") => TAG(n,c,s,t)
, SPAN = (t, c, s, n = "span") => TAG(n, c, s, t)
, BOLD = (t,c,s) => TAG("b",c,s,t)
, ITALIC = (t,c,s) => TAG("i",c,s,t)
, ROW = (c, s, e) => { const x = DIV("-row " + (c || ''), s); if (e) { typeof e == "string" ? x.html(e) : x.app(e); } return x }
, WSPAN = (t,c,s,n="span") => TAG(n,c,blend({ paddingLeft:"1em" }, s||{}),t)
, blend = function (e = {}) {
    for (let i = 1; i <= arguments.length - 1; i++) for (let j in arguments[i]) e[j] = arguments[i][j];
    return e
}
, EEvents = Object.freeze({
    CLICK: "click"
    , MOUSEENTER: "mouseenter"
    , MOUSELEAVE: "mouseleave"
    , MOUSEMOVE: "mousemove"
    , SUBMIT: "submit"
    , KEYUP: "keyup"
    , CHANGE: "change"
    , SEARCH: "search"

    , TCLICK: new Event("click")
    , TMOUSEENTER: new Event("mouseenter")
    , TMOUSELEAVE: new Event("mouseleave")
    , TMOUSEMOVE: new Event("mousemove")
    , TSUBMIT: new Event("submit")
    , TKEYUP: new Event("keyup")
    , TCHANGE: new Event("change")
    , TSEARCH: new Event("search")
})
;;

blend(Number.prototype, {
    fill: function (c, l, d) { return (this + "").fill(c, l, d) }
    , nerdify: function () {
        let n = this * 1;
        return n >= 1000000000000 ? ((n / 1000000000000).toFixed(1)) + "tri" : (
            n >= 1000000000 ? ((n / 1000000000).toFixed(1)) + "bi" : (
                n >= 1000000 ? ((n / 1000000).toFixed(1)) + "mi" : (
                    n >= 1000 ? ((n / 1000).toFixed(1)) + "k" : Math.ceil(n)
                )
            )
        )
    }
});

blend(NodeList.prototype, {
    array: function () {
        return [].slice.call(this);
    }
    , each: function (f) {
        return this.array().each(f)
    }
    , extract: function (f) {
        return this.array().extract(f)
    }
});

blend(HTMLCollection.prototype, {
    array: function () {
        return [].slice.call(this);
    }
    , each: function (f) {
        return this.array().each(f)
    }
    , extract: function (f) {
        return this.array().extract(f)
    }
    , evalute: function () {
        this.array().each(el => el.evalute())
    }
})

blend(HTMLFormElement.prototype, {
    json: function () {
        let tmp = {};
        this.get("input, textarea, select, .-value").each(o => {
            if (!o.has("-skip") && (o.name || o.dataset.name)) {
                let
                name = o.name || o.dataset.name
                , value = o.value || o.dataset.value || o.textContent
                ;;
                if (o.has("-list")) value = value.split(/\s+/gi).filter(i=>i);
                if (o.has("-hash")) value = Array.isArray(value) ? value.extract(x => { return x.hash() }) : value.hash();
                tmp[name] = value;
            }
        });
        return tmp;
    }
    , stringify: function () {
        return JSON.stringify(this.json())
    }
});

blend(Element.prototype, {
    at: function () { return this }
    , anime: function (obj, len = ANIMATION_LENGTH, delay = 0, trans = null) {
        const el = this;;
        return new Promise(function (ok) {
            len /= 1000;
            trans = trans ? trans : "ease";
            el.style.transition = "all " + len.toFixed(2) + "s " + trans;
            el.style.transitionDelay = (delay ? delay / 1000 : 0).toFixed(2) + "s";
            for (let i in obj) el.style[i] = obj[i];
            setTimeout(function (e) { return ok(e) }, len * 1000 + delay + 1, el)
        })
    }
    , mime: function () {
        return this.cloneNode(true)
    }
    , stop: function () {
        if (this.dataset.animationFunction) clearInterval(this.dataset.animationFunction);
        this.dataset.animationFunction = "";
        return this
    }
    , empty: function () {
        this.html("");
        return this
    }
    , css: function (o = null, fn = null) {
        if (o === null) return this;
        this.style.transition = "none";
        this.style.transitionDuration = 0;
        for (let i in o) this.style[i] = o[i];
        if (fn !== null && typeof fn == "function") setTimeout(fn.bind(this), 16, this);
        return this
    }
    , text: function (t = null, fn = null) {
        if (t == null || t == undefined) return this.textContent;
        this.textContent = t;
        if (fn) return fn.bind(this)(this);
        return this;
    }
    , html: function (tx = null) {
        if (tx !== null && tx !== false) this.innerHTML = tx;
        else return this.innerHTML;
        return this
    }
    , data: function (o = null, fn = null) {
        if (o === null) return this.dataset;
        blend(this.dataset, o);
        if (fn !== null && typeof fn == "function") fn.bind(this)(this);
        return this;
    }
    , attr: function (o = null, fn = null) {
        if (o === null) return null;
        let el = this;
        Object.keys(o).forEach(x => el.setAttribute(x, o[x]));
        if (fn !== null && typeof fn == "function") return fn(this);
        return this;
    }
    , _put_where_: function (obj = null, w = "beforeend") {
        let el = this;
        if (Array.isArray(obj) || HTMLCollection.prototype.isPrototypeOf(obj) || NodeList.prototype.isPrototypeOf(obj)) {
            obj.each(o => el._put_where_(o, w));
        } else if (obj) el.insertAdjacentElement(w, obj);
        return this
    }
    , aft: function (obj = null) { return this._put_where_(obj, "afterend") }
    , bef: function (obj = null) { return this._put_where_(obj, "beforebegin") }
    , app: function (obj = null) { return this._put_where_(obj, "beforeend") }
    , pre: function (obj = null) { return this._put_where_(obj, "afterbegin") }
    , append: function (obj = null) { return this._put_where_(obj, "beforeend") }
    , prepend: function (obj = null) { return this._put_where_(obj, "afterbegin") }
    , has: function (cls = null) {
        if (cls) return this.classList.contains(cls);
        return false
    }
    , dataSort: function (data = null, dir = "desc", noheader=true, str=false) {
        data = data || 'sort'
        let all = [].slice.call(this.children) ;;
        if (all.length) all.sort(function (a, b) {
            return dir == "asc" ? a.dataset[data] * 1 - b.dataset[data] * 1 : b.dataset[data] * 1 - a.dataset[data] * 1
        })
        all.each(el => el.raise())
        return this
    }
    , index: function () {
        return [].slice.call(this.parent().children).indexOf(this) - 1;
    }
    , evalute: function () {
        if (this.tagName == 'SCRIPT') {
            // console.log(this.textContent)
            eval(this.textContent);
            this.remove()
        } else {
            app.get("script", this).each(x => {
                eval(x.textContent);
                x.remove()
            })
        }
        return this
    }
    , on: function (action, fn, passive = { passive: true }) {
        const _self = this;
        if (Array.isArray(action)) action.map(act => _self.addEventListener(act, fn, passive))
        else _self.addEventListener(action, fn, passive);
        return this
    }
    , parent: function (pace = 1) {
        let
            tmp = this;
        while (pace--) tmp = tmp.parentElement;
        return tmp;
    }
    , upFind(tx = null) {
        if (tx) {
            let
                x = this;
            while (x.parentElement.tagName.toLowerCase() != "body" && !(x.parentElement.tagName.toLowerCase() == tx || x.parentElement.has(tx))) x = x.parentElement;
            return x.parentElement
        }
        return this.parentElement
    }
    , inPage: function() {
        let
        page = {
            top: this.parentElement.scrollTop,
            bottom: this.parentElement.scrollTop + window.innerHeight,
            height: window.innerHeight
        },
        element = {
            top: this.offsetTop,
            bottom: this.offsetTop + this.offsetHeight
        };
        return (element.top <= page.bottom + 1 && element.bottom >= page.top - 1) ? {
            offset: element.top - page.top,
            where: 1 - (element.top - page.top) / page.height
        } : false;
    }
    , scrollTo: function(el,fn=null) {
        if (!el) return -1;
        let
        length = 0;
        do {
            length += el.offsetTop;
            el = el.parentElement;
        } while (el.uid() != this.uid());
        this.scroll({top:length,behavior:"smooth"});
        fn&&fn();
    }
    , stopScroll: function() {
        this.scroll({top:this.scrollTop+1});
    }
    , get: function (el) {
        if (el) return [].slice.call(this.querySelectorAll(el));
        else return this;
    }
    , $: function (el) {
        if (el) return [].slice.call(this.querySelectorAll(el));
        else return this;
    }
    , remClass: function (c) {
        if (this.classList.contains(c)) {
            this.classList.remove(c);
        }
        return this;
    }
    , removeClass: function (c) {
        return this.remClass(c);
    }
    , addClass: function (c) {
        if (c) {
            let
                tmp = c.trim().split(/\s+/g)
                , i = tmp.length;
            if (c.length) while (i--) this.classList.add(tmp[i]);
        }
        return this;
    }
    , toggleClass: function(c) {
        let
        tmp = c.split(/\s+/g), i=tmp.length;
        while(i--) {
            if (tmp[i]) {
            if(!this.classList.contains(tmp[i]))
                this.classList.add(tmp[i]); else this.classList.remove(tmp[i]);
            }
            } return this;
    }
    , uid: function (name = null, hash = false) {
        if (name) this.id = name.replace(/[^0-9a-zA-Z]/g, "");
        if (!this.id) this.id = app.nuid();
        return (hash ? "#" : "") + this.id;
    }
    , move: function(obj,len=ANIMATION_LENGTH, anim="linear") {
        len /= 1000;
        this.style.transition = "all "+len+"s "+anim;
        if(obj.top!==undefined)this.style.transform = "translateY("+(this.offsetTop-obj.top)+")";
        if(obj.left!==undefined)this.style.transform = "translateX("+(this.offsetLeft-obj.left)+")";
    }
    , raise: function () {
        this.parentElement.appendChild(this)
        return this
    }
    , show: function (display = 'inline-block') {
        this.style.display = display || 'inline-block'
        return this
    }
    , appear: function (len = ANIMATION_LENGTH, fn = null) {
        return this.stop().css({ display: 'inline-block' }, x => x.anime({ opacity: 1 }, len).then(fn))
    }
    , hide: function () {
        this.style.display = 'none'
        return this
    }
    , desappear: function (len = ANIMATION_LENGTH, remove = false, fn = null) {
        return this.stop().anime({ opacity: 0 }, len).then(x => { if (remove) x.remove(); else x.css({ display: "none" }); if (fn) fn(remove ? null : this); });
    }
    , remove: function () { if (this && this.parentElement) this.parentElement.removeChild(this) }
});

blend(String.prototype, {
    hash: function () {
        let
            h = 0, c = "", i = 0, j = this.length;
        if (!j) return h;
        while (i++ < j) {
            c = this.charCodeAt(i - 1);
            h = ((h << 5) - h) + c;
            h |= 0;
        }
        return Math.abs(h).toString();
    }
    , sanitized_compare: function (word) {
        const w = this ;;
        return (new RegExp(
            w
                .trim()
                .replace(/\s+/giu, ' ')
                .replace(/(a|á|à|ã)/giu, "(a|á|à|ã)")
                .replace(/(e|é|ê)/giu,   "(e|é|ê)")
                .replace(/(i|í)/giu,     "(i|í)")
                .replace(/(o|ó|ô|õ)/giu, "(o|ó|ô|õ)")
                .replace(/(u|ú)/giu,     "(u|ú)")
                .replace(/(c|ç)/giu,     "(c|ç)")
            , 'giu')).test(word.trim().replace(/\s+/gi, ' ')) ? true : false
    }
    , btoa: function () {
        return btoa(this);
    }
    , atob: function () {
        return atob(this);
    }
    , list: function () {
        return this.split(/\s+/gi) || []
    }
    , fill: function (c = " ", l = 8, d = -1) {
        let
            s = this;
        c = !c ? " " : c;
        d = d == 0 || d == null || d == undefined ? -1 : d;
        while (s.length < l) s = (d < 0 ? c : "") + s + (d > 0 ? c : "");
        return s
    }
    , nerdify: function () {
        return (this * 1).nerdify()
    }
    , desnerdify: function () {
        let
            n = Number(this.replace(/[^0-9\.]/g, '').replace(',', '.'))
            , s = this.replace(/[^a-zA-Z]/g, '');
        switch (s) {
            case "tri": n *= 1000000000000; break;
            case "bi": n *= 1000000000; break;
            case "mi": n *= 1000000; break;
            case "k": n *= 1000; break;
            default: n *= 1; break;
        }
        return n
    }
    , json: function () {
        let
            result = null;
        try {
            result = JSON.parse(this);
        } catch (e) {
            console.trace(e)
        }
        return result;
    }
    , morph: function () {
        const
            x = document.createElement("div");;
        x.innerHTML = this
        return x.firstChild.tagName.toLowerCase() == "template" ? x.firstChild.content.children : x.children;;
    }
    , prepare: function (obj = null) {
        if (!obj) return this;
        let
            str = this.trim();
        Object.keys(obj).each(x => {
            let
                rgx = new RegExp("@" + x, "g");
            str = str.replace(rgx, obj[x]);
        })
        return str;
    }
});

blend(Array.prototype, {
    json: function (pretty = true) { return JSON.stringify(this, null, pretty ? 4 : null); }
    , clone: function () { return this.slice(0) }
    , each: function (fn) { if (fn && typeof fn == 'function') { for (let i = 0; i++ < this.length;) fn(this[i - 1], i - 1); } return this }
    , extract: function (fn = null) {
        if (!fn || !this.length) return this;
        let narr = [];
        this.each((o, i) => {
            let x = fn(o, i);
            if (x != null && x != undefined) narr.push(x)
        })
        return narr
    }
    , merge: function () {
        return [].concat.apply([], this)
    }
    , mutate: function (fn) {
        if (!fn) return this;
        return this.extract((x, i) => { return fn(x, i) })
    }
    , cast: function (filter = STRING) {
        return this.extract(x => { return filter == STRING ? x + "" : (filter == NUMBER ? x * 1 : x) })
    }
    , fit: function (n = 10) {
        let
            narr = [this.first()]
            , x = this.length / (n - 1)
            , i = x
            ;
        while (i < this.length) {
            narr.push(this.calc(TREND, i));
            i += x;
        }
        narr.push(this.last())
        return narr
    }
    , tiny: function (n = 10) {
        if (this.length <= n) return this;
        let
            arr = this.calc(SMOOTH, Math.floor(this.length / (n - 1)))
            , narr = [this.first()]
            , x = this.length / (n - 1)
            , i = Math.floor(x)
            ;
        while (i > 0 && i < this.length - 1) {
            narr.push(this[i] || null);
            i += Math.floor(x);
        }
        narr.push(this.last())
        return narr
    }
    , calc: function (type = SUM, helper = null) {
        let
            res = 0;
        switch (type) {
            case (SUM): this.each(x => res += x); break
            case (AVERAGE): this.each(x => res += x); res = res / this.length; break
            case (HARMONIC): this.each(x => res += 1 / x); res = this.length / res; break
            case (TREND): {
                let
                    m, b, x, y, x2, xy, z, np = this.length;
                m = b = x = y = x2 = xy = z = 0;
                if (!helper) helper = np;
                this.each((n, i) => {
                    x = x + i;
                    y = y + n;
                    xy = xy + i * n;
                    x2 = x2 + i * i;
                });
                z = np * x2 - x * x
                if (z) {
                    m = (np * xy - x * y) / z;
                    b = (y * x2 - x * xy) / z;
                }
                res = m * helper + b
            } break

            /* TODO POLINOMIAL FORMULA */
            case (INTERPOLATE): {
                if (helper == null || helper == undefined) {
                    app.error("Ops! a 'x' value is needed for array basic interpolation...")
                    return 0
                }
                // const
                // interpolate = (mix, x) => {
                const mix = this;
                var result = .0;
                mix.each((yi, xi) => {
                    var lag = 1;
                    mix.each((yn, xn) => { if (xn != xi) lag *= ((helper - xn) / (xi - xn)) })
                    result += (yi * lag);
                });
                res = result;
                // }
                // return interpolate(this, helper)
            } break;
            case (PROGRESS): {
                let
                    me = this;
                res = this.extract((x, i) => { return i ? me[i] / me[i - 1] : 1 }).calc(AVERAGE)
            } break;
            case (MAX): {
                if (!this.length) return 0;
                res = Math.max(...this)
            } break;
            case (MIN): {
                if (!this.length) return 0;
                res = Number.MAX_SAFE_INTEGER;
                this.each(x => res = Math.min(res, x))
            } break;
            case (RELATIFY): {
                res = this.calc(MAX);
                res = this.extract(x => x / res)
            } break;
            case (SMOOTH): {
                const
                    narr = []
                    , arr = this
                    , len = this.length
                    , xx = Math.max(1, Math.floor(helper / 2))
                    ;;
                this.each((x, i) => narr.push(app.iterate(Math.max(0, i - xx), Math.min(len, i + xx)).extract(x => arr[x]).calc(AVERAGE)))
                return narr
            } break;
        }
        return res;
    }
    , fillNulls: function () {
        let
            final
            , nulls = []
            , narr = this.extract((el, i) => {
                let
                    y = Array.isArray(el) ? el[1] : el
                    , x = Array.isArray(el) ? el[0] : i
                    ;;
                if (y == null || y == undefined) nulls.push(x);
                else return [x, y];
            })
        nulls.each((x, n) => narr.push([n, narr.calc(INTERPOLATE, n)]));
        narr.sort(function (a, b) { return a[0] - b[0] })
        return narr;
    }
    , last: function (n = null) {
        if (!this.length) return null;
        if (n === null) return this[this.length - 1];
        return this.slice(Math.max(this.length - n, 0));
    }
    , first: function (n = null) {
        if (!this.length) return null;
        if (n === null) return this[0];
        return this.slice(0, n);
    }
    , at: function (n = 0) {
        if (n >= 0) return this.length >= n ? this[n] : null;
        return this.length > n * -1 ? this[this.length + n] : null
    }
    , rand: function () {
        return this[Math.floor(Math.random() * this.length)]
    }
    , not: function (el) {
        let
            arr = this;
        while (arr.indexOf(el) + 1) arr.splice(arr.indexOf(el), 1);
        return arr;
    }
    , anime: function (obj, len = ANIMATION_LENGTH, delay = 0, trans = null) {
        this.each(x => x.anime(obj, len, delay, trans));
        return this
    }
    , stop: function () {
        this.each(x => x.stop())
        return this
    }
    , raise: function () {
        this.each(x => x.raise());
        return this
    }
    , css: function (obj, fn = null) {
        this.each(x => x.css(obj, fn));
        return this
    }
    , data: function (obj, fn = null) {
        this.each(x => x.data(obj, fn));
        return this
    }
    , attr: function (obj, fn = null) {
        this.each(x => x.attr(obj, fn));
        return this
    }
    , text: function (txt, fn = null) {
        this.each(x => x.text(txt, fn));
        return this
    }
    , addClass: function (cl = null) {
        if (cl) this.each(x => x.addClass(cl));
        return this
    }
    , remClass: function (cl = null) {
        if (cl) this.each(x => x.remClass(cl));
        return this
    }
    , removeClass: function (cl = null) {
        return this.remClass(cl)
    }
    , toggleClass: function(cl=null) {
        if(cl) this.each(x => x.toggleClass(cl));
        return this
    }
    , remove: function () {
        this.each(x => x.remove());
        return this
    }
    , on: function (act = null, fn = null) {
        if (act && fn) this.each(x => x.on(act, fn));
        return this
    }
    , empty: function () {
        this.each(x => x.empty())
        return this
    }
    , clear: function () {
        return this.extract(n => {
            return n != null && n != undefined && n != NaN && n != window ? (n instanceof String ? n + "" : (n instanceof Number ? n * 1 : n)) : null
        })
    }
    , evalute: function () {
        this.each(el => el.evalute())
    }
    , html: function (v) {
        this.each(el => el.html(v));
        return this
    }
    , show: function (display = 'inline-block') {
        return this.map(x => x.style.display = display || 'inline-block')
    }
    , appear: function (len = ANIMATION_LENGTH) {
        return this.each(x => x.css({ display: 'block' }, x => x.anime({ opacity: 1 }, len, 1)))
    }
    , hide: function () {
        return this.map(x => x.style.display = 'none')
    }
    , desappear: function (len = ANIMATION_LENGTH, remove = false, fn = null) {
        return this.each(x => x.desappear(len, remove, fn))
    }
    , val: function(v=null){
        if(v) this.each(x => { if(x.tagName.toLowerCase()=="input") x.value = v })
        return this
    }
    , app: function (el = null) {
        if (el) {
            this.each(x => x.app(el.mime()))
        }
        return this
    }
});

Object.defineProperty(Object.prototype, "spy", {
    value: function (p, fn) {
        let
            o = this[p]
            , set = function (v) { return fn(v, p, this) };
        if (delete this[p]) { // can't watch constants
            Object.defineProperty(this, p, { set: set })
        }
    }
});

//       _
//   ___| | __ _ ___ ___  ___  ___
//  / __| |/ _` / __/ __|/ _ \/ __|
// | (__| | (_| \__ \__ \  __/\__ \
//  \___|_|\__,_|___/___/\___||___/

class fDate extends Date {

    plus(n) {
        let
        date = new Date(this.valueOf());
        date.setDate(date.getDate() + n);
        return new fDate(date)
    }

    export(format = TS_MASK){
        let
        d = this || fDate.now()
        , arr = format.split("")
        ;;
        arr.each(n => {
            switch(n){
                case "Y": format = format.replace(n, d.getFullYear());                             break;
                case "y": format = format.replace(n, ((d.getYear()-100)   + "").fill("0", 2, -1)); break;
                case "m": format = format.replace(n, ((d.getMonth()+1)    + "").fill("0", 2, -1)); break;
                case "d": format = format.replace(n, (d.getDate()         + "").fill("0", 2, -1)); break;
                case "h": format = format.replace(n, (d.getHours()        + "").fill("0", 2, -1)); break;
                case "i": format = format.replace(n, (d.getMinutes()      + "").fill("0", 2, -1)); break;
                case "s": format = format.replace(n, (d.getSeconds()      + "").fill("0", 2, -1)); break;
                case "k": format = format.replace(n, (d.getMilliseconds() + "").fill("0", 3, -1)); break;
                case "t": format = format.replace(n, d.getTime());                                 break;
                case "M": format = format.replace(n, MONTHS[d.getMonth()+(12*LOCALE_OFFSET)]);          break;
                case "D": format = format.replace(n, DAYS[d.getDay()+(7*LOCALE_OFFSET)]);              break;
            }
        })
        return format
    }

    as(format){
        return this.export(format)
    }

    format(format){
        return this.export(format)
    }

    isValid(date){
        if(date) return (new fDate(date)).isValid();
        else if(this.getTime()) return this
        return null
    }

    now(){
        return new fDate()
    }

    time(){
        return this.getTime()
    }

    static guess(datestr){
        /**
         * possibilities:
         *     - Tue Jun 08 19:34:03 +0000 2021
         */
        if(!datestr) return false;

        var dat ;;

        if(!isNaN(datestr)) {
            if((datestr+'').length == 10) datestr = parseInt(datestr + '000');
            dat = new fDate();
            dat.setTime(datestr);
        } //else dat = new fDate(datestr);

        if(dat&&dat.getTime()) return dat;
        datestr = (datestr).toLowerCase();

        let
        datefound = null
        , i = 0
        , fmatch = datestr.replace(/[.,-/]/gi, ' ').replace(/\s+/gi, ' ').match(/[a-z]{3}[\s-/][0-9]{2}[\s-/][0-9]{4}/gi)
        ;;

        if(fmatch?.length){
            datestr = fmatch[0].split(/[\s-/]/gi);
            datestr = datestr[1] + '-' + datestr[0] + '-' + datestr[2]
        }

        MONTHS.map((m, i) => datestr = datestr.replace(m, (((i++%12)+1)+"").fill("0", 2, -1)));
        datestr = datestr.replace(/[^a-z0-9:]|(rd|th|nd|de)/gi, ' ').replace(/\s+/gi, ' ').trim();

        [
            /[0-9]{2}.{1,5}[0-9]{2}.{1,5}[0-9]{4}/gi
            , /[0-9]{4}.{1,5}[0-9]{2}.{1,5}[0-9]{2}/gi
        ].forEach(rx => {
            if(datefound) return;
            const dt = datestr.match(rx);
            if(dt&&dt.length) datefound = dt[0].replace(/\s+/gi, '-')
        })

        if(datefound) {
            const dat = datefound.match(/[0-9]{2}\-[0-9]{2}\-[0-9]{4}/gi);
            if(dat&&dat.length) datefound = datefound.split('-').reverse().join('-')
            datefound = datefound.slice(0, 10)
        }

        datefound = datefound ? new fDate(datefound+"T03:00:00.000Z") : false;

        return datefound && datefound.as('Y')*1 > 1000 ? datefound : false
    }

    static now(){
        return new fDate()
    }

    static plus(n=1){
        return fDate.now().plus(n)
    }

    static time(){
        return Date.now()
    }

    static at(n){
        return fDate.now().plus(n)
    }

    static as(format=TS_MASK){
        return fDate.now().export(format)
    }

    static format(format){
        return fDate.now().export(format)
    }

    static cast(date){
        return new fDate(date || new Date)
    }

    static yday(){
        return parseInt(fDate.plus(-1).getTime()/1000)*1000
    }

    static tday(){
        return parseInt(fDate.time()/1000)*1000
    }
}

class Pool {
    add(x = null, v = null) {
        if (x) {
            if (Array.isArray(x)) this.sort(x);
            if (typeof x === 'function') {
                this.execution.push(x);
                if (this.execution.length > this.timeline.length) this.at(v)
            }
            else this.conf(x, v)
        }
        return this;
    }
    push(x) {
        this.add(x);
        return this
    }
    sort(x) {
        let
            pool = this;
        if (Array.isArray(x)) {
            x.each(z => pool.add(z))
        }
        return this;
    }
    conf(k = null, v = null) {
        if (k !== null) {
            if (v !== null) this.setup[k] = v;
        }
        return this
    }
    at(t = null) {
        this.moment = t && parseInt(t) ? t : this.moment + 1;
        this.timeline.push(this.moment);
        return this
    }

    plus(t = 0) { return this.at(this.moment + t) }
    fire(x = null) {
        if (typeof x == "function") {
            this.add(x, this.moment + 1);
            x = null
        }
        let
            pool = this;

        const
            o = new Promise(function (pass, deny) {
                pool.execution.each((z, i) => {
                    if (z) pool.timeserie[i] = setTimeout(z, pool.timeline[i], x, pool.setup);
                })
                setTimeout(function (ok) { return pass(ok) }, pool.timeserie.calc(MAX) + ANIMATION_LENGTH / 4, true)
            })

        return o
    }
    stop(i = null) {
        if (i !== null) { if (this.timeserie[i]) clearInterval(this.timeserie[i]) }
        else this.timeserie.each(x => clearInterval(x))
        return this
    }
    clear() {
        this.stop();
        this.moment = 0;
        this.timeline = [];
        this.timeserie = [];
        this.execution = [];
        this.setup = {};
        return this
    }
    debug() {
        console.log("CONFIGURATION");
        console.log(this.setup);
        console.log("TIMESERIE");
        this.timeline.each((x, i) => { console.log("AT:" + x + " => DO:" + this.execution[i]) })
    }
    after(fn = null) {
        if (fn && typeof fn == 'function') setTimeout(fn, this.moment + 1);
        return this
    }
    drop(e) {
        if (!e) return this;
        const
            i = this.execution.indexOf(e);
        if (i + 1) this.execution[i] = null;
    }
    constructor(x) {
        this.moment = 0;
        this.timeline = [];
        this.timeserie = [];
        this.execution = [];
        this.setup = {};
        return this.add(x)
    }
};

class Swipe {
    constructor(el,len=10) {
        this.len = len;
        this.x = null;
        this.y = null;
        this.e = typeof(el) === 'string' ? $(el).at() : el;
        if(!this.e) return;
        this.e.on('touchstart', function(v) {
            this.x = v.touches[0].clientX;
            this.y = v.touches[0].clientY;
        }.bind(this));
    }

    left(fn) { this.__LEFT__ = new Throttle(fn,this.len); return this }

    right(fn) { this.__RIGHT__ = new Throttle(fn,this.len); return this }

    up(fn) { this.__UP__ = new Throttle(fn,this.len); return this }

    down(fn) { this.__DOWN__ = new Throttle(fn,this.len); return this }

    move(v) {
        if(!this.x || !this.y) return;
        let
        diff = (x,i)=>{ return x-i },
        X = v.touches[0].clientX,
        Y = v.touches[0].clientY;

        this.xdir = diff(this.x,X);
        this.ydir = diff(this.y,Y);

        if(Math.abs(this.xdir)>Math.abs(this.ydir)) { // Most significant.
            if(this.__LEFT__&&this.xdir>0) this.__LEFT__.fire();
            else if(this.__RIGHT__) this.__RIGHT__.fire();
        }else{
            if(this.__UP__&&this.ydir>0) this.__UP__.fire();
            else if(this.__DOWN__) this.__DOWN__.fire()
        }
        this.x = this.y = null
    }

    fire() { this.e&&this.e.on('touchmove', function(v) { this.move(v) }.bind(this)) }
};

/*
 * @class
 *
 * handle the minimum amount of time to wait until executions of a given function
 * good to prevent events like scroll and typing to fire some actions multiple
 * times decreasing performance affecting user's experience
 *
 */
class Throttle {
    /*
     * @constructor
     *
     * f = javascript function to be applied
     * t = time betwin executions of 'f' (250ms is the default)
     * ex.: new __self.Throttle(minha_funcao,400);
     *
     */
    constructor(f, t = ANIMATION_LENGTH/2) {
        this.assign(f,t);
    }

    /*
     * @member function
     *
     * assign values to inner class attributes
     * f = javascript function to be applied
     * t = time betwin executions of 'f' (250ms is the default)
     * ex.: (new __self.Throttle).assign(minha_funcao) // assuming default delay time
     *
     */
    assign(f, t) {
        this.func = f;
        this.delay = t;
        this.timer = (new Date()).getTime();
    }

    /*
     * @member function
     *
     * execute given function assigned on constructor or assign() mmber function
     * ex.: (new __self.Throttle).apply()
     * obs.: the fire() member function will only execute the inner function if the
     * given ammount of time is passed, otherway if won't do anything
     *
     */
    fire() {
        if(!this.func) return;
        let
        now = (new Date()).getTime();
        if (now - this.delay > this.timer) {
            eval(this.func)( ... arguments);
            this.timer = now;
        }
    }
};

class Bootloader {

    loadLength() {
        return Object.values(this.loaders).filter(n => n * 1 ? true : null).length / Array.from(this.dependencies).length;
    }

    check(scr) {
        return scr ? this.loaders[scr] : this.alreadyLoaded
    }

    ready(scr) {
        const
            tmp = this;

        Array.from(this.dependencies).map(x => { tmp.loaders[x] = tmp.loaders[x] ? 1 : 0 });
        if (scr!=null&&scr!=undefined) this.loaders[scr] = 1;

        let perc = this.loadLength();

        if (!this.alreadyLoaded && perc >= 1) {
            this.alreadyLoaded = true;
            setTimeout(boot => boot.onFinishLoading.fire(), AL, this);
        } else if (!this.alreadyLoaded) setTimeout((x, perc) => x.onReadyStateChange.fire(perc), AL / 4, this, perc);

        return this.alreadyLoaded || false;
    }

    pass() {
        this.dependencies = new Set(["pass"]);
        return this.ready("pass");
    }

    constructor(dependencies) {
        this.alreadyLoaded = false;
        this.loadComponents = new Pool();
        this.onReadyStateChange = new Pool();
        this.onFinishLoading = new Pool();
        this.dependencies = new Set(dependencies || ["pass"]);
        this.loaders = {};
    }

};

class CallResponse {
    constructor(url = location.href, args = {}, method = "POST", header = {}, data = null) {
        this.url = url;
        this.args = args;
        this.method = method;
        this.headers = header;
        this.data = data;
        this.status = this.data ? true : false;
    }
};

class FObject extends Object {

    static cast(o){
        return new FObject(o)
    }

    isNull(){
        return Object.values(this).length && true
    }
    static isNull(o){
        return FObject.cast(o).isNull()
    }

    map(fn){
        const me = {...this}, res = [] ;;
        Object.keys(me).map(k => res.push(fn(me[k], k)))
        return res
    }
    static map(o, fn){
        return FObject.cast(o).map(fn)
    }

    json(){
        return JSON.stringify({...this})
    }
    static json(o){
        var res;
        try {
            if(typeof o == 'string') res = JSON.parse(o)
            else res = JSON.stringify(o)
        } catch(e) {}
        return res
    }

    spread(){
        return this.isNull() ? null : {...this}
    }
    static spread(o){
        return FObject.cast(o).spread()
    }

    constructor(o){
        super()
        const me = this ;;
        Object.keys(o||{}).forEach(k => me[k] = o[k]);
        const attrs = Object.keys(me) ;;
        attrs.map(attr => {
            const l = attr.length ;;
            if(attr == 'id_') return;
            if(attr[l-1] == '_' && me[attr.slice(0, l-1)] === undefined) me[attr.slice(0, l-1)] = function(x) {
                if(undefined!==x && null!==x) me[attr]=x;
                return typeof me[attr] == "string" && !isNaN(me[attr]) ? me[attr]*1 : me[attr]
            }
        })
    }

}

class app {

    static pallete = {
        ALIZARIN: "#E84C3D"
        , PETER_RIVER: "#2C97DD"
        , ICE_PINK: "#CA179E"
        , EMERLAND: "#53D78B"
        , SUN_FLOWER: "#F2C60F"
        , AMETHYST: "#9C56B8"
        , CONCRETE: "#95A5A5"
        , WET_ASPHALT: "#383C59"
        , TURQUOISE: "#00BE9C"
        , PURPLE_PINK: "#8628B8"
        , PASTEL: "#FEC200"
        , CLOUDS: "#ECF0F1"
        , CARROT: "#E67D21"
        , MIDNIGHT_BLUE: "#27283D"
        , WISTERIA: "#8F44AD"
        , BELIZE_HOLE: "#2A80B9"
        , NEPHRITIS: "#30AD63"
        , GREEN_SEA: "#169F85"
        , ASBESTOS: "#7E8C8D"
        , SILVER: "#BDC3C8"
        , POMEGRANATE: "#C0382B"
        , PUMPKIN: "#D35313"
        , ORANGE: "#F39C19"
        , BURRO_QNDO_FOJE: "#8C887B"
        , LIME: "#BAF702"
        /*** SYSTEM***/
        , BACKGROUND: "#FFFFFF"
        , FOREGROUND: "#ECF1F2"
        , FONT: "#2C3D4F"
        , FONTINVERTED: "#F2F2F2"
        , FONTBLURED: "#7E8C8D"
        , SPAN: "#2980B9"
        , DISABLED: "#BDC3C8"
        , DARK1: "rgba(0,0,0,.08)"
        , DARK2: "rgba(0,0,0,.16)"
        , DARK3: "rgba(0,0,0,.32)"
        , DARK4: "rgba(0,0,0,.64)"
        , LIGHT1: "rgba(255,255,255,.08)"
        , LIGHT2: "rgba(255,255,255,.16)"
        , LIGHT3: "rgba(255,255,255,.32)"
        , LIGHT4: "rgba(255,255,255,.64)"
        /*** PALLETE ***/
        , WHITE: "#FFFFFF"
        , BLACK: "#000000"
        , CYAN:"#01F2F2"
        , MAGENTA:"#E10085"
        , YELLOW:"#F2DE00"
        , RED:"#FF0000"
        , GREEN:"#00FF00"
        , BLUE:"#0000FF"
    }

    static rx(w, wrule=2, b="\\b", asrx=true, flags='guim'){
        const
        hasnum = parseInt((0+(w||'')).replace(/[^0-9]/gui, ''))
        , midrule = "([^-'0-9a-zÀ-ÿ]{0,2}[-'0-9a-zÀ-ÿ]+[^-'0-9a-zÀ-ÿ]{0,2}){0," + wrule + "}"
        , replaced = `(${b}` + (w||'').trim()
        .replace(/(a|á|à|ã)/giu, "(a|á|à|ã)")
        .replace(/(e|é|ê)/giu,   "(e|é|ê)")
        .replace(/(i|í)/giu,     "(i|í)")
        .replace(/(o|ó|ô|õ)/giu, "(o|ó|ô|õ)")
        .replace(/(u|ú)/giu,     "(u|ú)")
        .replace(/(c|ç)/giu,     "(c|ç)")
        .replace(/\s+/giu, `.{0,2}${b})${midrule}(`) + `.{0,2}${b})`
        ;;
        return asrx ? new RegExp(replaced, flags) : replaced
    }

    static color(c){
        var res;
        if(c){
            if(this.pallete[c]) res = this.pallete[c];
        } else res = this.pallete
        return res
    }

    static async client_ip(){
        if(!this.client_ip_) this.client_ip_ = await (await fetch("https://ipinfo.io/ip")).text();
        return this.client_ip_
    }

    static initialize() { initpool.fire() }

    static async call(url, args = null, method = null, head = null) {
        try {
            method = method ? method : (args ? "POST" : "GET")
            var tmp;
            if (method == "POST") tmp = blend({
                'Accept'        : 'application/json'
                , 'Content-Type': 'application/json;charset=UTF-8'
            }, head);
            head = tmp

            const
            req = await fetch(url, args ? {
                method
                , headers : new Headers(head)
                , body    : FObject.json(blend(args || {}, { _ts: fDate.time() }))
            } : { method, headers: new Headers(head) })
            , res = await req.text()
            ;;
            return new CallResponse(url, args, method, req, res);
    } catch(e) {
            console.log({ err: e, url, args, head })
        }
    }

    static async post(url, args, head = null) {
        return app.call(url, args, "POST", head)//blend({ 'Accept': 'application/json', 'Content-Type': 'application/json; charset=UTF-8' }, head || {}))
    }

    static async load(url, args = null, target = null, bind = null) {
        return app.call(url, args).then(r => {
            if (!r.status) return app.error("error loading " + url);
            r = r.data.prepare(blend({ UID: app.nuid() }, bind, app.pallete)).morph();
            if (!target) target = $('#app')[0];
            r instanceof HTMLCollection ? r.array().each(e => { target.app(e); e.evalute() }) : target.app(r) && r.evalute();
            return r
        })
    }

    static async exec(url, args = null) {
        if(!app.execs) app.execs = {}
        else if(app.execs[url]) return eval(app.execs[url].prepare(app.pallete))(app, args)
        const res = await this.call(`js/${url.indexOf('.js')+1 ? url : url+'.js'}`) ;;
        if (!res.status) return this.error("error loading " + url)
        // res.data = res.data.prepare(app.pallete)
        app.execs[url] = res.data
        return eval(app.execs[url].prepare(app.pallete))(app, args)
    }

    static uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        })
    }

    static nuid(n = 32, prefix = "e") {
        let a = prefix + "";
        n -= a.length;
        const keyspace = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('')
        while (n-- >= 0) a += String(keyspace[Math.floor((Math.random() * keyspace.length))])
        return a
    }

    static sanitized_compare(w1, w2) {
        return w1.sanitized_compare(w2)
    }

    /*
     * @Override
     */
    static loading(show = true, target, txt = '<img src="assets/img/spin.svg" style="transform:scale(.25)"/>') {
        $('toast').remove();
        $('tooltip').hide();

        const loading_list = $(".--loading", (target || $("#app")[0])) ;;

        if (show && loading_list.length) {
            $(".-pulse", loading_list[0])[0].html(txt);
            return
        }

        if (!show) loading_list.each(e => e.anime({ transform: 'scale(1.5)', filter: 'opacity(0)' }).then(e => e.remove()))
        else {
            const
            load = WRAP(DIV('-centered').app(SPAN(txt, "-pulse", {
                fontSize: "4em"
                , color: "#0004"
            }, "i")), "-absolute -zero --loading", {
                background: app.color('BACKGROUND')
                , opacity: .8
                , zIndex: 10000
            })
            ;;
            (target || $("#app")[0]).app(load);
            load.anime({ transform: 'scale(1)', filter: 'opacity(1)' })
        }

    }

    static notify(n, c = null) {
        const
        toast = document.createElement("toast")
        , clr = app.pallete
        ;;
        toast.addClass("-fixed -tile -content-left --notification").css({
            background: c && c[0] ? c[0] : clr.FOREGROUND
            , color: c && c[1] ? c[1] : clr.FONT
            , boxShadow: "0 0 .5em " + clr.DARK2
            , borderRadius: ".25em"
            , padding: "1em"
            , display: 'block'
            , opacity: 0
            , fontWeight: "bolder"
            , zIndex: 10010
        }).innerHTML = n ? n : "Hello <b>World</b>!!!";
        if (!app.is_mobile()) {
            toast.css({
                top: 0,
                right: 0,
                width: "20vw",
                margin: ".5em"
            });
        } else {
            toast.css({
                top: 0,
                left: 0,
                width: "100vw"
            })
        }
        toast.onclick = function () { clearTimeout(this.dataset.delay); this.desappear(ANIMATION_LENGTH / 2, true); };
        toast.onmouseenter = function () { clearTimeout(this.dataset.delay); };
        toast.onmouseleave = function () {
            this.dataset.delay = setTimeout(t => { t.desappear(ANIMATION_LENGTH / 2, true); }, ANIMATION_LENGTH, this);
        };
        document.getElementsByTagName('body')[0].appendChild(toast);
        this.tileClickEffectSelector(".-tile");

        toast.raise()

        let
        notfys = $("toast.--notification")
        , ht = 0
        ;
        notfys.forEach(x => {
            x.anime({ transform: "translateY(" + ht + "px)", opacity: 1 }, ANIMATION_LENGTH / 4)
            ht += x.getBoundingClientRect().height + 8;
        });
        toast.dataset.delay = setTimeout(function () { toast.desappear(ANIMATION_LENGTH / 2, true); }, ANIMATION_LENGTH * 5);
        return toast
    }

    static error(message = null) {
        return app.notify(message || "Ops! Something went wrong...", [app.color().POMEGRANATE, app.color().CLOUDS])
    }
    static success(message = null) {
        return app.notify(message || "Hooray! Success!", [app.color().GREEN_SEA, app.color().WHITE])
    }
    static warning(message = null) {
        return app.notify(message || "Ops! take attention...", [app.color().SUN_FLOWER, app.color().WET_ASPHALT])
    }
    static working(message = null) {
        return app.notify(message || "Hooray! Success!", [app.color().PETER_RIVER, app.color().WHITE])
    }

    //static hintify(n = null, o = {}, delall = true, keep = false, special = false, evenSpecial = false) {
    static hintify(opts={}) {

        if (opts.delall) $(".--hintifyied" + (opts.special ? ", .--hintifyied-sp" : "")).forEach(x => x.desappear(ANIMATION_LENGTH, true));

        opts.css = blend({
            top: Math.min(window.innerHeight * .95, maxis.clientY) + "px"
            , left: Math.min(window.innerWidth * .8, maxis.clientX) + "px"
            , boxShadow: "0 0 2em " + app.color("DARK4")
            , padding:".5em"
            , borderRadius: ".25em"
            , background: app.color("BACKGROUND")
            , color: app.color("FONT")
            , zIndex: 9000
        }, opts.css);

        if (opts.text) opts.content = ("<p>" + opts.text + "</p>").morph()

        let toast = TAG("toast", "-block -fixed --hintifyied" + (opts.special ? "-sp" : ""), opts.css).css({ opacity: 0 }).app(opts.content || SPAN("Toastie!!!")) ;;
        if (toast.get(".--close").length) toast.get(".--close").on("click", function () { this.upFind("toast").desappear(ANIMATION_LENGTH, true) })
        else toast.on("click", function () { this.desappear(ANIMATION_LENGTH, true) });

        if (!opts.keep) {
            toast.on(EEvents.MOUSELEAVE, function () {
                $(".--hintifyied" + (opts.special ? ", .--hintifyied-sp" : "")).stop().desappear(ANIMATION_LENGTH, true)
            }).on(EEvents.MOUSEENTER, function () {
                this.stop()
            }).dataset.animationFunction = setTimeout(toast => toast.desappear(ANIMATION_LENGTH, true), ANIMATION_LENGTH * 8, toast)
        }

        $('body')[0].app(toast.appear())

        return toast
    }

    static window(html = null, title = null, css = {}) {
        const
        head = TAG("header", "-relative -row -zero --window-header -no-scrolls").app(
            DIV("-left -content-left -ellipsis --drag-trigger", { cursor: 'all-scroll', minHeight: "3em", lineHeight: 3, width: "calc(100% - 9em)", fontWeight: 500 }).app(
                typeof title == "string" ? ("<span class='-row -no-scrolls' style='height:3em;padding:0 1em;opacity:.75'>" + title + "</span>").morph()[0] : title
            ).on("click", function () { this.upFind("--window").raise() })
        ).app(
            // CLOSE
            DIV("-right -pointer --close -tile").app(
                IMG("assets/img/icons/cross.svg", app.pallete.type == "dark" ? "-inverted" : null, { height: "2.75em", width: "2.75em", padding: ".75em" })
            ).on("click", function () {
                this.upFind("--window").desappear(AL, true)
                setTimeout(_null => $(".--minimized").each((el, i) => { el.anime({ left: (10 + (i * 13.3)) + 'vw' }) }), AL)
            })
        ).app(
            // MINIMIZE
            DIV("-right -pointer --minimize -tile").app(
                IMG("assets/img/icons/minimize.svg", app.pallete.type == "dark" ? "-inverted" : null, { height: "2.75em", width: "2.75em", padding: ".75em" })
            ).on("click", function () {
                const
                    win = this.upFind("--window")
                    ;;
                if (win.has("--minimized")) {
                    const pos = win.dataset.position.json() ;;
                    this.anime({ transform: "rotate(0deg)" });
                    win.$(".-wrapper")[0].style.display = "block";
                    win.anime({ height: pos.h + "px", width: pos.w + "px", top: pos.y + "px", left: pos.x + "px", transform: "translate(-50%, -50%)" });
                    win.remClass("--minimized");
                } else {
                    win.dataset.position = FObject.json({
                        w: win.offsetWidth
                        , h: win.offsetHeight
                        , x: win.offsetLeft
                        , y: win.offsetTop
                    });
                    this.anime({ transform: "rotate(180deg)" });
                    win.$(".-wrapper")[0].hide();
                    win.anime({ height: "3em", width: "13.3vw", top: "calc(100vh - 1.5em)", left: "6.75vw" });
                    win.addClass("--minimized");
                }
                $(".--minimized").each((el, i) => { el.anime({ left: (6.75 + (i * 13.3)) + 'vw' }) })

            })
        )
        , wrapper = DIV("-zero -wrapper", { height: "calc(100% - 3em)" })
        , _W = DIV("--window -fixed -no-scrolls --drag-target -centered", blend({
            height: "70vh"
            , width: "70vw"
            , background: app.color("BACKGROUND")
            , border: "none"
            , borderRadius: ".5em"
            , boxShadow: "0 0 12em black"
            , color: app.color("FONT")
            , zIndex: 8000
            , resize: "both"
            , padding: "0"
        }, css)).data({ state: "default" })
        ;;

        if (html) wrapper.app(typeof html == "string" ? html.prepare(blend(app.pallete, translate())).morph() : html);

        $("#app")[0].app(_W.app(head).app(wrapper));

        this.tileClickEffectSelector(".-tile");

        wrapper.evalute();
        app.sleep(ANIMATION_LENGTH).then(NULL => _W.raise());

        app.enableDragging();

        return _W;

    }

    static dialog(html = null, title = null, css = {}) {
        return app.window(html, title, blend({
            height: "40vh"
            , width: "24vw"
            , top: "50%"
            , left: "50%"
            , background: app.pallete.BACKGROUND
            , borderRadius: ".25em"
            , boxShadow: "0 0 2em " + app.pallete.DARK4
            , color: app.pallete.FONT
        }, css))
        ;;
    }

    static get(w = null, c = null) { return $(w, c || document) }

    static args(field = null) {
        const args = {};;
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (NULL, k, v) => args[k] = decodeURI(v))
        return field === null ? args : (args[field] ? args[field] : null);
    }

    static new(node = 'div', cls = "", style = {}, fn) {
        let name = node, id = false;
        if (name.indexOf("#") + 1) {
            id = name.split("#")[1];
            name = name.split("#")[0] || "div";
        }
        node = document.createElement(name).addClass(cls).css(style, fn);
        if (id) node.id = id;
        return node;
    }

    static storage(field = null, value = null) {
        if (field == null || field == undefined) return false;
        if (value === null) return window.localStorage.getItem(field);
        window.localStorage.setItem(field, value === false ? "" : value);
        return window.localStorage.getItem(field);
    }

    static clearStorage() {
        Object.keys(window.localStorage).map(x => window.localStorage.removeItem(x))
    }

    static cook(field=null, value=null, days=356){
        if(field){
            let
            date = new Date();
            if(value!==null){
                date.setTime(date.getTime()+(days>0?days*24*60*60*1000:days));
                document.cookie = field+"="+value+"; expires="+date.toGMTString()+"; path=/";
            }else{
                field += "=";
                document.cookie.split(';').each(c => {
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if(c.indexOf(field)==0) value = c.substring(field.length,c.length);
                });
                return value
            }
        }
    }

    static ucook(field=null){
        if(field) app.cook(field,"",-1);
    }

    static is_mobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }

    static colors(color = "light") {
        const clrs = app.pallete ;;
        return color && clrs[color] ? clrs[color] : clrs
    }

    static sanitize(str) {
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+')
    }

    static async sleep(time = ANIMATION_LENGTH) {
        return new Promise(function (ok) {
            setTimeout(function () { return ok() }, time)
        })
    }

    static iterate(s, e, fn, step = 1) {
        const x = [];
        if (!fn) fn = i => i;
        s = s || 0;
        e = e || s + 1;
        for (let i = s; i != e; i += step) x.push(fn(i));
        return x;
    }

    static clean(w) {
        return w.replace(/[^-0-9a-zÀ-ÿ]/gui, ' ').replace(/\s+/gui, ' ').trim()
    }

    static makeBase64ImgFromUrl(url, fn){
        const
        img = new Image()
        ;
        img.onload = function(){
            let
            canvas = document.createElement('canvas')
            , ctx = canvas.getContext('2d')
            , data
            ;;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            data = canvas.toDataURL();
            canvas = null;
            fn(data)
        };
        img.crossOrigin = 'Anonymous';
        img.src = url;
    }

    static rgb2hex(color) {
        let
        hex = "#";
        if(!Array.isArray(color)) color = color.split(/[\s+,.-]/g);
        color.slice(0,3).each(clr => {
            let
            tmp = (clr*1).toString(16);
            hex += tmp.length == 1 ? "0" + tmp : tmp
        });
        if(color[3]) hex += (255*color[3]).toString(16)
        return hex.substring(0,9)
    }

    static hex2rgb(color) {
        let
        rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return  rgb ? [ parseInt(rgb[1] || 255, 16), parseInt(rgb[2] || 255, 16), parseInt(rgb[3] || 255, 16), parseInt(rgb[3] || 255, 16) ] : null;
    }

    static em2px(n=1) {
        return parseFloat(getComputedStyle(document.body).fontSize)*n;
    }

    static download(data, filename, filetype="text"){
        if(!data) return;
        if(!filename) filename = 'app.txt';
        if(typeof data === "object") data = JSON.stringify(data);
        var
        blob = new Blob([data], {type: filetype})
        , e = document.createEvent('MouseEvents')
        , a = document.createElement('a')
        ;;
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl =  [ filetype, a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }

    static copy2clipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    static enableDragging() {

        $(".--drag-trigger, .--drag").each((x, i) => {

            if (x.has(".--drag-enabled")) return;

            var ax = 0, ay = 0, bx = 0, by = 0;
            const
                tgt = x.has("--drag") ? x : x.upFind("--drag-target")
                , dragselect = e => {
                    e.preventDefault();
                    bx = e.clientX;
                    by = e.clientY;
                    document.onmouseup = dragend;
                    document.onmousemove = dragstart;
                }
                , dragstart = e => {
                    e.preventDefault();
                    tgt.style.transition = 'none';
                    tgt.style.transitionDelay = "0s";
                    ax = bx - e.clientX;
                    ay = by - e.clientY;
                    bx = e.clientX;
                    by = e.clientY;
                    tgt.style.top = (tgt.offsetTop - ay) + "px";
                    tgt.style.left = (tgt.offsetLeft - ax) + "px";
                }
                , dragend = e => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
                ;;

            if (tgt == $('#app')[0]) return;

            x.attr({ draggable: "true" }).onmousedown = dragselect;

            x.addClass("--drag-enabled");
        })
    }

    static tileClickEffectSelector(cls = null, clr = null) {
        if (!cls) return;
        $(cls).each((x, i) => {
            if (!x.has("--effect-selector-attached")) {
                x.addClass("-no-scrolls").on("click", function (e) {
                    if (this.classList.contains("-skip")) return;
                    let
                        bounds = this.getBoundingClientRect()
                        , size = Math.max(bounds.width, bounds.height);
                    this.app(TAG("span", "-absolute", {
                        background: clr || (app.color().FONT + "66")
                        , display: "inline-block"
                        , borderRadius: "50%"
                        , width: size + "px"
                        , height: size + "px"
                        , opacity: .4
                        , top: e.layerY + "px"
                        , left: e.layerX + "px"
                        , transformOrigin: "center center"
                        , transform: "translate(-50%, -50%) scale(0)"
                    }, x => x.anime({ transform: "translate(-50%, -50%) scale(1.5" }, ANIMATION_LENGTH / 2).then(x => x.desappear(ANIMATION_LENGTH / 4, true))))
                }).addClass("--effect-selector-attached")
            }
        })
    }

    static tooltips() {
        var ttip = document.getElementById('tooltip');
        if (!ttip) {
            document.getElementById("app").app(
                TAG("tooltip#tooltip", "-fixed --tooltip-element", {
                    padding: ".5em"
                    , borderRadius: ".25em"
                    , border: "1px solid " + app.color('FONT') + '44'
                    , background: app.color("BACKGROUND")
                    , color: app.color("FONT")
                    , display: "none"
                    , zIndex: 9999
                })
            )
            $("tooltip#tooltip").on("mouseleave", function(){ this.css({ display: "none" }) })
        }
        $(".--tooltip").each(tip => {
            tip.on(EEvents.MOUSEENTER, function (e) {
                if(!this.dataset.tip) return;
                document.getElementById("tooltip").css({ display: 'none' }).html(this.dataset.tip == "@" ? this.textContent : this.dataset.tip).css({
                    display: "block"
                    , background: this.dataset.tipbg || app.color("BACKGROUND")
                    , color: this.dataset.tipft || app.color("FONT")
                    , width: this.dataset.tipwidth||'auto'
                })
            }).on(EEvents.MOUSEMOVE, function (e) {
                const tgt = document.getElementById("tooltip");;
                tgt.style.top = (24 + e.clientY) + "px";
                tgt.style.left = (24 + e.clientX) + "px";
                tgt.style.transform = (e.clientX > window.innerWidth * .9) ? 'translateX(calc(-100% + -48px))' : 'translateX(0)';
            }).on(EEvents.MOUSELEAVE, function () { document.getElementById("tooltip").css({ display: "none" }) });
        }).removeClass("--tooltip")
    }

    static $(wrapper = null, context = document) {
        const t = [].slice.call(context.querySelectorAll(wrapper))
        return t
    }
}

blend(window, {
    maxis: { x: 0, y: 0 }
    , initpool: new Pool()
    , $: app.$
    , bootloader: new Bootloader()
    , app: app
    , GET: async (url, callback, args, head) => {
        var res = await app.call(url + (args ? `?${new URLSearchParams(args).toString()}` : ''), null, 'GET', head) ;;
        try { res = JSON.parse(res.data) } catch(e) { res = res.data }
        return callback ? callback(res) : res
    }
    , POST: async (url, args, callback, head) => {
        var res = await app.call(url, args, 'POST', head) ;;
        try { res = JSON.parse(res.data) } catch(e) { res = res.data }
        return callback ? callback(res) : res
    }
})

window.onmousemove = e => window.maxis = e
window.oncontextmenu = e => {
    let evs = [] ;;
    e.path.forEach(el => el?.dataset?.contextEvent ? evs.push(el.dataset.contextEvent) : null)
    try{
        if(evs.length && app.contextEvents && app.contextEvents[evs[0]]) app.contextEvents[evs[0]](e)
    } catch(er) {
        console.trace(er)
    }
    return false
}

document.addEventListener("touchstart", function() {}, true);

// console.log('  __\n\ / _| __ _  __ _ _   _\n\| |_ / _` |/ _` | | | |\n\|  _| (_| | (_| | |_| |\n\|_|  \\__,_|\\__,_|\\__,_|')
console.log("\n ___ _ __  _   _ _ __ ___   ___\n/ __| '_ \\| | | | '_ ` _ \\ / _ \\\n\\__ \\ |_) | |_| | | | | | |  __/\n|___/ .__/ \\__,_|_| |_| |_|\\___|\n    |_|\n")