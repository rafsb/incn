/**************************************************************************
     ___                                             _
    /  _|_ __ __ _ _ __ ___   _____      _____  _ __| | __
    | |_| '__/ _` | '_ ` _ \ / _ \ \ /\ / / _ \| '__| |/ /
    |  _| | | (_| | | | | | |  __/\ V  V / (_) | |  |   <
    |_| |_|  \__,_|_| |_| |_|\___| \_/\_/ \___/|_|  |_|\_\


****************************************************************************/
const
ANIMATION_LENGTH = 800
, DEBUG = false
// , REVERSE_PROXY_CLIENT_URI = "https://cors-anywhere.herokuapp.com/"
, SUM               = 0
, MEDIAN            = 1
, HARMONIC          = 2
, PASSWD_AUTO_HASH  = true;
;
var
bind = (e,o)=>{
    let
    a = Object.keys(o);
    for(let i=a.length; i--;) e[a[a.length-i-1]] = o[a[a.length-i-1]];
};
NodeList.prototype.array = function() {
    return [].slice.call(this);
};
HTMLCollection.prototype.array = function() {
    return [].slice.call(this);
};
bind(HTMLFormElement.prototype,{
    json: function(){
        let
        tmp = {};
        this.get("input, textarea, select, .-value").each(o=>{
            if(!o.has("-skip")&&o.name){            
                tmp[o.name] = (o.tagName.toUpperCase()=="TEXTAREA"&&o.has("-list") ? o.value.split('\n') : o.value);
                if(PASSWD_AUTO_HASH&&o.getAttribute("type")&&o.getAttribute("type").toUpperCase()=="PASSWORD") tmp[o.name] = tmp[o.name].hash();
            }
        });
        return tmp;
    }
    , up: function(name, path, fn=null, mini=false) {
        let
        ctnr = this.uid()
        , form = new FormData()
        , counter = 0;

        name = name || app.uid(13);

        form.append("picture", this.files[0]);
        form.append("name", name);
        form.append("path", path);
        form.append("minify", mini?1:0);

        xhr = new XMLHttpRequest();
        // xhr.onprogress = function(d) {
        //     $(".--progress").anime({width:(d.loaded/d.total*100)+"%"});
        // }
        if(fn) xhr.upload.onload = function() {
            let
            timer = setInterval(function() {
                if (xhr.responseText) {
                    eval(fn)(JSON.parse(xhr.responseText));
                    clearInterval(timer);
                }
                if (counter++ >= ANIMATION_LENGTH) {
                    app.notify("Ops! Imagem n茫o pode ser carregada, chama o Berts!",["#ff0066","white"]);
                    clearInterval(timer);
                }
            }, ANIMATION_LENGTH/10);
        }
        xhr.upload.onerror = function() {
            app.notify("Ops! N茫o foi poss铆vel subir esta imagem... chama o berts...",["#ff0066","white"]);
        };
        xhr.open("POST", "image/upload");
        xhr.send(form);
    }
});
bind(HTMLInputElement.prototype, {
    setValue: function(v="") {
        this.value = v;
        return this
    }
});
bind(Element.prototype,{
    anime: function(obj,len=ANIMATION_LENGTH,delay=0,fn=null,trans=null) {
        len/=1000;
        trans = trans ? trans : "ease";
        this.style.transition = "all " + len.toFixed(2) + "s "+trans;
        this.style.transitionDelay = (delay?delay/1000:0).toFixed(2)+"s";
        for(let i in obj) {
            switch(i) {
                case "skew"   : this.style.transform = 'skew('+obj[i]+','+obj[i]+')'; break;
                case "skewX"  : this.style.transform = 'skewX('+obj[i]+')'; break;
                case "skewY"  : this.style.transform = 'skewY('+obj[i]+')'; break;
                case "scale"  : this.style.transform = 'scale('+obj[i]+')'; break;
                case "scaleX" : this.style.transform = 'scaleX('+obj[i]+')'; break;
                case "scaleY" : this.style.transform = 'scaleY('+obj[i]+')'; break;
                case "translate"  : this.style.transform = 'translate('+obj[i]+','+obj[i]+')'; break;
                case "translateX" : this.style.transform = 'translateX('+obj[i]+')'; break;
                case "translateY" : this.style.transform = 'translateY('+obj[i]+')'; break;
                case "rotate"     : this.style.transform = 'rotate('+obj[i]+')'; break;
                // case "opacity"    : this.style.filter = 'opacity('+obj[i]+')'; break;
                case "grayscale"  : this.style.filter = 'grayscale('+obj[i]+')'; break;
                case "invert"     : this.style.filter = 'invert('+obj[i]+')'; break;
                default : this.style[i] = obj[i]; break;
            }
        }
        if(fn!==null&&typeof fn=="function") this.dataset.animationFunction = setTimeout(fn.bind(this),len*1000+delay+1,this);
        return this;
    }
    , stop: function() {
        if(this.dataset.animationFunction) clearInterval(this.dataset.animationFunction);
        this.dataset.animationFunction = "";
        return this
    }
    , empty: function(a=null) {
        if(a){ if(typeof a == 'string') a = a.split(',') }
        else a = [];
        this.get("*").each(function() {if(!(a.indexOf(this.tagName)+1)) this.remove()});
        return this
    }
    , setText: function(t=null, fn=null){
        if(!t) return this;
        this.textContent = t;
        if(fn) return fn.bind(this)(this);
        return this;
    },
     setData: function(o=null, fn=null){
        if(!o) return this;
        let
        args = Object.keys(o);
        for(let i=0;i++<=args.length;){
            this.dataset[args[i-1]] = o[args[i-1]];
        }
        if(fn) return fn.bind(this)(this);
        return this;
    }
    , setStyle: function(o=null, fn = null) {
        if (o===null) return this;
        this.style.transition = "none";
        this.style.transitionDuration = 0;
        for(let i in o) {
            switch(i) {
                case "skew"  : this.style.transform = 'skew('+o[i]+','+o[i]+')'; break;
                case "skewX" : this.style.transform = 'skewX('+o[i]+')'; break;
                case "skewY" : this.style.transform = 'skewY('+o[i]+')'; break;
                case "scale" : this.style.transform = 'scale('+o[i]+')'; break;
                case "scaleX" : this.style.transform = 'scaleX('+o[i]+')'; break;
                case "scaleY" : this.style.transform = 'scaleY('+o[i]+')'; break;
                case "translate" : this.style.transform = 'translate('+o[i]+','+o[i]+')'; break;
                case "translateX" : this.style.transform = 'translateX('+o[i]+')'; break;
                case "translateY" : this.style.transform = 'translateY('+o[i]+')'; break;
                case "rotate" : this.style.transform = 'rotate('+o[i]+')'; break;
                default : this.style[i] = o[i]; break;
            }
        }
        if(fn!==null&&typeof fn=="function") setTimeout(fn.bind(this),16, this);
        return this
    }
    , text: function(tx=null) {
        if(tx) this.textContent = tx;
        else return this.textContent;
        return this
    }
    , html: function(tx=null) {
        if(tx) this.innerHTML = tx;
        else return this.innerHTML;
        return this
    }
    , data: function(o=null, fn=null) {
        if (o===null) return this.dataset;
        bind(this.dataset, o);
        if(fn!==null&&typeof fn=="function") fn.bind(this)(this);
        return this;
    }
    , attr: function(o=null, fn = null) {
        if (o===null) return null;
        let el = this;
        Object.keys(o).each(function(){ el.setAttribute(this+"",o[this+""]); }) ;
        if(fn!==null&&typeof fn=="function") fn.bind(this)();
        return this;
    }
    , after: function(obj=null) {
        let
        el=this;
        if(Array.isArray(obj)) obj.each(o=>el.after(o));
        else if(obj) el.insertAdjacentElement("afterend",obj);
        return this;
    }
    , before: function(obj=null) {
        let
        el=this;
        if(Array.isArray(obj)) obj.each(o=>el.before(o));
        else if(obj) el.insertAdjacentElement("beforebegin",obj);
        return this;
    }
    , append: function(obj=null) {
        let
        el=this;
        if(Array.isArray(obj)) obj.each(o=>el.append(o));
        else if(obj) el.insertAdjacentElement("beforeend",obj);
        return this;
    }
    , prepend: function(obj=null) {
        let
        el=this;
        if(Array.isArray(obj)) obj.each(o=>el.prepend(o));
        else if(obj) el.insertAdjacentElement("afterbegin",obj);
        return this;
    }
    , has: function(cls=null) {
        if(cls) return this.classList.contains(cls);
        return false
    }
    , dataSort: function(data=null,dir="asc") {
        let
        me = this,
        all = [].slice.call(this.children);
        if(all.length) {
            for(let i=all.length;i--;) {
                for(let j=0;j<i;j++) {
                    if((dir=="asc"&&(all[j].dataset[data]>all[j+1].dataset[data]))||(dir=="desc"&&(all[j].dataset[data]<all[j+1].dataset[data]))) {
                        let
                        tmp = all[j];
                        all[j] = all[j+1];
                        all[j+1] = tmp;
                    }
                }
            }
            all.each(function() { me.append(this) })
        }
        return this
    }
    , index: function() {
        return [].slice.call(this.parent().children).indexOf(this)-1;
    }
    , evalute: function() {
        this.get("script").each(function(){ eval(this.textContent)&&this.remove() })
        return this
    }
    , on: function(action,fn,passive=true) {
        this.addEventListener(action,fn, {passive:passive})
        return this
    }
    , parent: function(pace=1) {
        let
        tmp = this;
        while(pace--) tmp = tmp.parentElement;
        return tmp;
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
    , get: function(el) {
        if(el) return [].slice.call(this.querySelectorAll(el));
        else return this;
    }
    , remClass: function(c) {
        if (this.classList.contains(c)) {
            this.classList.remove(c);
        }
        return this;
    }
    , addClass: function(c) {
        let
        tmp = c.split(/\s+/g), i=tmp.length;
        if(c.length) while(i--) this.classList.add(tmp[i]);
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
    , uid: function(name=null) {
        if(name) this.id = name;
        if(!this.id) this.id = app.nuid(8);
        return this.id;
    }
    , move: function(obj,len=ANIMATION_LENGTH, anim="linear") {
        len /= 1000;
        this.style.transition = "all "+len+"s "+anim;
        if(obj.top!==undefined)this.style.transform = "translateY("+(this.offsetTop-obj.top)+")";
        if(obj.left!==undefined)this.style.transform = "translateY("+(this.offsetLeft-obj.left)+")";
    }
    , appear: function(len = ANIMATION_LENGTH) {
        return this.setStyle({display:'inline-block'},function(){ this.anime({opacity:1},len,1); });
    }
    , desappear: function(len = ANIMATION_LENGTH, remove = false) {
        return this.anime({opacity:0},len,1,function() { if(remove) this.remove(); else this.setStyle({ display : "none" }); });
    }
    , remove: function() { this&&this.parent()&&this.parent().removeChild(this) }
    , at: function(i=0) {
        return this.nodearray.at(i)
    }
});
bind(String.prototype,{
    hash: function() {
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
    , btoa: function(){
        return btoa(this);
    }
    , atob: function(){
        return atob(this);
    }
    , json: function() {
        let
        result = null;
        try{
            result = JSON.parse(this);
        } catch(e) {
            // statements
            console.log(e);
        }
        return result;
    }
    , morph: function() {
        let
        x = document.createElement("div");
        x.innerHTML = this.replace(/\t+/g, "").trim();
        return x.firstChild.tagName.toLowerCase()=="template" ? x.firstChild.content.children.array() : x.children.array();
    }
    , prepare: function(obj=null){
        if(!obj) return this;
        let
        str = this;
        for(i in obj){
            let
            rgx = new RegExp("@"+i,"g");
            str = str.replace(rgx,obj[i])
        }
        return str
    }
    , uri: function(){
        return this.replace(/[^a-zA-Z0-9]/g,'_')
    }
});
bind(Object.prototype,{
    json:function(){ return JSON.stringify(this); }
    , stringify: function() {
        return JSON.stringify(this);
    }
});
bind(Array.prototype, {
    json: function(){ return JSON.stringify(this); }
    , clone: function() {
        return this.slice(0);
    }
    , each: function(fn) { if(fn) { for(let i=0;i++<this.length;) fn.bind(this[i-1])(this[i-1],i-1); } return this; }
    , extract: function(fn=null){
        if(!fn||!this.length) return this;
        let
        narr = [];
        this.each(function(o,i){ 
            let
            x = fn.bind(this)(this,i);
            if(x) narr.push(x) 
        });
        return narr;
    }
    , calc: function(type=SUM){
        let
        res = 0;
        switch (type){
            case (SUM): this.each(function(){ res+=this*1 }); break;
            case (MEDIAN): this.each(function(){ res+=this*1 }); res = res/this.length; break;
            case (HARMONIC): this.each(function(){ res+=1/this*1 }); res = this.length/res; break;
        }
        return res;
    }
    , last: function() { return this.length ? this[this.length-1] : null; }
    , first: function() { return this.length ? this[0] : null; }
    , at: function(n=0) { return this.length>=n ? this[n] : null; }
    , stringify: function() {
        return JSON.stringify(this);
    }
    , not: function(el) { 
        let
        arr = this;
        while(arr.indexOf(el)+1) arr.splice(arr.indexOf(el),1);
        return arr;
    }
    , anime: function(obj,len=ANIMATION_LENGTH,delay=0,fn=null,trans=null) {
        this.each(function() {this.anime(obj,len,delay,fn,trans)});
        return this
    }
    , setStyle: function(obj,fn=null) {
        this.each(function() {this.setStyle(obj,fn)});
        return this
    }
    , setData: function(obj,fn=null) {
        this.each(function() {this.setData(obj,fn)});
        return this
    }
    , setText: function(txt,fn=null) {
        this.each(function() {this.setText(txt,fn)});
        return this
    }
    , addClass: function(cl=null) {
        if(cl) this.each(function() {this.addClass(cl)});
        return this
    }
    , remClass: function(cl=null) {
        if(cl) this.each(function() {this.remClass(cl)});
        return this
    }
    , toggleClass: function(cl=null) {
        if(cl) this.each(function() {this.toggleClass(cl)});
        return this
    }
    , remove: function() {
        this.each(function() {this.remove()});
        return this
    }
    , setValue: function(v='') {
        this.each(function() {this.value = v});
        return this
    }
    , on: function(act=null,fn=null) {
        if(act&&fn) this.each(function(){ this.on(act,fn) });
        return this
    }
    , evalute: function(){
        this.each(me=>{ 
            if(me.tagName.toLowerCase()=="script") eval(me.textContent); 
            else me.get("script").evalute()
        })
    }
    , appear: function(len = ANIMATION_LENGTH) {
        return this.each(function(){ this.setStyle({display:'block'},function(){ this.anime({opacity:1},len,1); }); });
    }
    , desappear: function(len = ANIMATION_LENGTH, remove = false){
        return this.each(function(){ this.anime({opacity:0},len,1,function() { if(remove) this.remove(); else this.setStyle({ display : "none" }); }); });
    }
});

Object.defineProperty(Object.prototype, "spy", {
    value: function (p,fn) {
        let
        o = this[p]
        , n = o
        , get = function() { return n }
        , set = function(v) { o = n; return n = fn.bind(this)(v,p) };
        if(delete this[p]) { // can't watch constants
            Object.defineProperty(this,p,{ get: get, set: set })
        }
    }
});
// object.unwatch
Object.defineProperty(Object.prototype, "unspy", {
    value: function (prop) {
        let
        val = this[prop];
        delete this[prop];
        this[prop] = val;
    }
});
//       _
//   ___| | __ _ ___ ___  ___  ___
//  / __| |/ _` / __/ __|/ _ \/ __|
// | (__| | (_| \__ \__ \  __/\__ \
//  \___|_|\__,_|___/___/\___||___/
//
class Pool {
    add(x=null,v=null) {
        if(x) {
            if(Array.isArray(x)) this.sort(x);
            if(typeof x === 'function') { 
                this.execution.push(x);
                if(this.execution.length > this.timeline.length) this.at(v)
            }
            else this.conf(x,v)
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
        if(Array.isArray(x)) {
            x.each(function(){ pool.add(this) })
        }
        return this;
    }
    conf(k=null,v=null) {
        if(k!==null) {            
            if(v!==null) this.setup[k]=v;
        }
        return this
    }
    at(t=null) {
        this.moment = t&&parseInt(t) ? t : this.moment+1;
        this.timeline.push(this.moment);
        return this
    }

    plus(t=0) { return this.at(this.moment +t) }
    fire(x=null) {
        if(typeof x == "function"){
            this.add(x,this.moment+1);
            x=null
        }
        let
        pool=this;
        this.execution.each(function(i){ 
            pool.timeserie[i] = setTimeout(this, pool.timeline[i], x, pool.setup);
        });
        return this;
    }
    stop(i=null) {
        if(i!==null) { if(this.timeserie[i]) clearInterval(this.timeserie[i]) }
        else this.timeserie.each(function(){ clearInterval(this) })
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
        this.timeline.each((i,x)=>{console.log("AT:"+x+" => DO:"+this.execution[i])})
    }
    after(fn=null) {
        if(fn&&typeof fn=='function') setTimeout(fn,this.moment+1);
        return this
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
            else if(this.__DOWN__) this.__DOWN__.fire();
        }
        this.x = this.y = null;
    }

    fire() {
        this.e&&this.e.on('touchmove', function(v) { this.move(v) }.bind(this));
    }
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
    fire(d) {
        let
        now = (new Date()).getTime();
        if (now - this.delay > this.timer) {
            eval(this.func)(d);
            this.timer = now;
        }
    }
};
class Bootstrap {   
    pace(){
        var 
        i=0;
        for(;++i<Object.keys(this.loaders).length;);
        return 100/i;
    }
    loadLength(){
        var
        i=0
        , count=0
        , loaders = Object.keys(this.loaders);
        for(;i++<=loaders.length;) if(this.loaders[loaders[i-1]]) count++;
        return count*this.pace();
    }
    check(scr){
        return scr ? this.loaders[scr] : this.alreadyLoaded
    }
    ready(scr){
        if(scr) this.loaders[scr] = true;

        let
        perc = this.loadLength()
        , bootprogress = $(".--boot-progress");
        
        if(bootprogress.length) bootprogress.anime({width:(perc)+"%"})

        if(perc>=99&&!this.alreadyLoaded){ 
            this.onFinishLoading.fire(()=>{ return app ? app.pragma = app.initial_pragma : true; }, ANIMATION_LENGTH);
            this.alreadyLoaded=true; 
        }

        return this.alreadyLoaded || false;
    }
    constructor(){
        this.alreadyLoaded = false;
        this.loadComponents = new Pool();
        this.onFinishLoading = new Pool();
        this.loaders = {
            continuing: true 
        }
    }
};
class CallResponse {
    constructor(url=location.href, args={}, method="POST", header={}, data=null){
        this.url = url;
        this.args=args;
        this.method=method;
        this.headers=header;
        this.data=data;
        this.status = this.data ? true : false;
    }
}
class FAAU {
    get(e,w){ return faau.get(e,w||document).nodearray; }
    declare(obj){ Object.keys(obj).each(function(){ window[this+""] = obj[this+""] }); }
    initialize(){ bootstrap&&bootstrap.loadComponents.fire(); }
    async call(url, args=null, method='POST', head={}) {
        head["Content-Type"] = head["Content-Type"] || "text/plain"
        head["FA-Custom"] = "@rafsb"
        return fetch(url,{
            method: method
            , body: args ? args.stringify() : null
            , headers : head
            , credentials: "include"
        }).then(r=>r=r.text()).then(r=>{
            return new CallResponse(url, args, method, head, r.trim());
        });
        // let
        // xhr = new XMLHttpRequest();
        // args = args ? args : {};
        // if(!sync&&fn) {
        //     xhr.onreadystatechange = function() {
        //         if (xhr.readyState == 4) {
        //            return fn.bind({ status: xhr.status, data: xhr.responseText.trim(), url:url, args:args })();
        //         };
        //     }
        // }
        // xhr.open(method, url, !sync);
        // // xhr.setRequestHeader("Content-Type", "plain/text");
        // // xhr.setRequestHeader("Accept", 'application/json');
        // if(head) for(let i in head){ xhr.setRequestHeader(i,head[i]); };
        // xhr.send(JSON.stringify(args));
        // if(sync) {
        //     let
        //     o = { status: xhr.status, data: xhr.responseText.trim(), url:url, args:args };
        //     return (fn ? fn.bind(o)() : o);
        // }
    }

    async load(url, args=null, target=null) {
        return this.call(url, args).then( r => {
            if(!r.status) return app.error("error loading "+url);
            r = r.data.prepare(app.colors()).morph();
            if(!target) target = app.get('body')[0];
            target.append(r);
            return r.evalute();
        });
    }

    get(el,scop=document) { return [].slice.call(scop ? scop.querySelectorAll(el) : this.nodes.querySelectorAll(el)); }

    nuid(n=8) { let a = "FA"; n-=2; while(n-->0) { a+="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('')[parseInt((Math.random()*36)%36)] } return a }

    notify(n, c=null) {
        let
        toast = document.createElement("toast");
        toast.setStyle({
            fontSize: "1rem",
            background: c&&c[0] ? c[0] : "rgba(255,255,255,.8)",
            color: c&&c[1] ? c[1] : "black",
            boxShadow:"0 0 8px gray",
            zIndex:200000,
            display:'block',
            opacity:0,
            position:"fixed"
        }).innerHTML = n ? n : "Hello <b>World</b>!!!";
        if(!this.isMobile()) {
            toast.setStyle({
                top:0,
                left:"80vw",
                width:"calc(20vw - 4rem)",
                padding:".5rem",
                borderRadius:".5rem",
            });
        }else{
            toast.setStyle({
                opacity:0,
                top:".5rem",
                left:".5rem",
                width:"calc(100% - 1rem)",
                padding:"1.5rem",
            });
        }
        toast.onclick = function() { clearTimeout(this.dataset.delay);this.desappear(ANIMATION_LENGTH/2,true); };
        toast.onmouseenter = function() { clearTimeout(this.dataset.delay); };
        toast.onmouseleave = function() {
            this.dataset.delay = setTimeout(function(t) { t.desappear(ANIMATION_LENGTH/2,true); }, ANIMATION_LENGTH, this);
        };
        document.getElementsByTagName('body')[0].appendChild(toast);
        
        let
        notfys = app.get("toast");
        notfys.each(function(i) { this.anime({ translateY: ( ( toast.offsetHeight + 8 ) * i + 16) + "px", opacity: 1 }, ANIMATION_LENGTH/4) });
        toast.dataset.delay = setTimeout(function() { toast.desappear(ANIMATION_LENGTH/2,true); }, ANIMATION_LENGTH*5);
    }

    loading(show=true){
        if(!show){
            $(".--default-loading").each(function(){ clearInterval(this.dataset.animation); this.remove() });
            return;
        }
        app.body.append(document.createElement("div").addClass("-fixed -view -zero --default-loading"));

         app.load("src/img/loading.svg",null,$(".--default-loading")[0],function(){
            let
            circle = $(".--default-loading .--loading-circle")[0];
            if(!circle) return;
            circle.setStyle({transformOrigin:"top left", scale:window.innerWidth/1920,"stroke-dasharray":circle.getTotalLength()+","+circle.getTotalLength()+","+circle.getTotalLength()});
            $(".--default-loading")[0].dataset.animation = setInterval(()=>{
                let
                circle = $(".--default-loading .--loading-circle")[0];
                if(circle){ 
                    circle.setStyle({"stroke-dashoffset":0});
                    circle.anime({"stroke-dashoffset":circle.getTotalLength()*4},2200,0,null,"ease-in-out")
                }
            },2201)
        })
    }

    error(message=null) {
        app.notify(message || "Ops! Something went wrong...", ["#7F2B2A","whitesmoke"])
    }
    success(message=null) {
        app.notify(message || "Hooray! Success!", ["#3CB371","whitesmoke"])
    }

    hintify(n, o={},delall=true,keep=false,special=false,evenSpecial=false) {
        if(delall) $(".--hintifyied"+(evenSpecial?", .--hintifyied-sp":"")).each(function() {this.remove()});

        let
        toast = app.new("toast");
        n = (typeof n == 'string' ? n.morph() : n);
        o.display = 'inline-block';
        o.transform = 'scale(1.05)';
        o.opacity = 0;
        o.zIndex = 200000;
        o.top = o.top||o.top==0 ? o.top : (mouseAxis.y+24)+"px";
        o.left = o.left||o.left==0 ? o.left : (mouseAxis.x+24)+"px";
        o.padding = o.padding||o.padding==0 ? o.padding : ".5rem";
        o.borderRadius = o.borderRadius ? o.borderRadius : "3px";
        o.boxShadow =  o.boxShadow ? o.boxShadow :  "0 0 8px gray";
        o.background =  o.background ? o.background : "rgba(40,40,40,.92)";
        o.color =  o.color ?  o.color : "white";
        o.position = "absolute";
        o.fontSize = o.fontSize ? o.fontSize : "1rem";
        toast.setStyle(o).addClass("--hintifyied"+(special?"-sp":"")).appendChild(n ? n : ("<b>路路路</b>!!!").morph());

        if(toast.get(".--close").length) toast.get(".--close").at().on("click",function() { $(".--hintifyied"+(special?", .--hintifyied-sp":"")).remove() });
        else toast.on("click",function() { this.remove() });
        if(!keep) toast.on("mouseleave",function() {$(".--hintifyied"+(special?", .--hintifyied-sp":"")).remove() });

        toast.anime({scale:1,opacity:1});
        $('body')[0].append(toast);
    }

    apply(fn,obj=null) { return (fn ? fn.bind(this)(obj) : null) }

    get(w=null,c=null) { return $(w,c); }

    //get length() { return this.nodearray.length }

    each(fn=null) {this.nodearray.each(fn);return this }

    at(n=0) { return this.nodearray.at(n) }

    first() {return this.nodearray.first() }

    last() {return this.nodearray.last() }

    empty(except=null) { this.nodearray.each(function() {this.empty(except)})}

    remove() { this.nodearray.each(function() {this.remove()})}

    anime(obj,len=ANIMATION_LENGTH,delay=0,fn=null,trans=null) {
        this.nodearray.each(function() {this.anime(obj,len,delay,fn,trans)})
        return this;
    }

    new(node='div', cls="auto-created", style={display:"inline-block"}, fn) {
        return document.createElement(node).addClass(cls).setStyle(style,fn);
    }

    storage(field=null,value=null){
        if(!field) return false;
        if(!value) return window.localStorage.getItem(field);
        window.localStorage.setItem(field,value);
        return window.localStorage;
    }

    isMobile(){
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }

    colors(pallete="light"){
        return pallete&&this.color_pallete[pallete] ? this.color_pallete[pallete] : this.color_pallete;
    }

    hashit(o){ if(typeof o == "object" || typeof o == "array") o = JSON.stringify(o); return { hash: btoa(o) } }

    makeServerHashToken(o){ return this.hashit(o).hash; }

    constructor(wrapper,context) {
        this.initial_pragma = 0
        this.current        = 0
        this.last           = 0
        this.body           = document.getElementById("app") || document.getElementsByTagName("body")[0]
        this.onPragmaChange = new Pool()
        this.nodes = document;
        this.nodearray = [];
        this.color_pallete = {
            light : {
                /*** SYSTEM***/
                CLR_BACKGROUND : "#FFFFFF"
                , CLR_FOREGROUND : "#ECF1F2"
                , CLR_FONT : "#2C3D4F"
                , CLR_FONTBLURED:"#7E8C8D"
                , CLR_SPAN :"#2980B9"
                , CLR_DISABLED: "#BDC3C8"
                , CLR_DARK1:"rgba(0,0,0,.16)"
                , CLR_DARK2:"rgba(0,0,0,.32)"
                , CLR_DARK3:"rgba(0,0,0,.64)"
                , CLR_LIGHT1:"rgba(255,255,255,.16)"
                , CLR_LIGHT2:"rgba(255,255,255,.32)"
                , CLR_LIGHT3:"rgba(255,255,255,.64)"
                /*** PALLETE ***/
                , CLR_WET_ASPHALT:"#34495E"
                , CLR_MIDNIGHT_BLUE:"#2D3E50"
                , CLR_CONCRETE:"#95A5A5"
                , CLR_ASBESTOS:"#7E8C8D"
                , CLR_AMETHYST:"#9C56B8"
                , CLR_WISTERIA:"#8F44AD"
                , CLR_CLOUDS:"#ECF0F1"
                , CLR_SILVER:"#BDC3C8"
                , CLR_PETER_RIVER:"#2C97DD"
                , CLR_BELIZE_HOLE:"#2A80B9"
                , CLR_ALIZARIN:"#E84C3D"
                , CLR_POMEGRANATE:"#C0382B"
                , CLR_EMERALD:"#53D78B"
                , CLR_NEPHIRITIS:"#27AE61"
                , CLR_CARROT:"#E67D21"
                , CLR_PUMPKIN: "#D35313"
                , CLR_TURQUOISE:"#00BE9C"
                , CLR_GREEN_SEA:"#169F85"
                , CLR_SUNFLOWER:"#F2C60F"
                , CLR_ORANGE: "#F39C19"
            }
        };
        if(wrapper) {
            let 
            el = (context ? (typeof context == 'string' ? document.querySelectorAll(context)[0] : context) : document);
            this.nodearray = el ? [].slice.call(el.querySelectorAll(wrapper)) : [];
        }
    }
};
bind(window, {
    mouseAxis: { x:0, y:0 }
    , $: function(wrapper=null, context=document) { return [].slice.call((new FAAU(wrapper,context)).nodearray); }
    , bootstrap: new Bootstrap()
    , app: (new FAAU())
    , base_hash: function(obj){
        switch(typeof obj){
            case "object" || "array" : return btoa(JSON.stringify(obj));    break;
            case "string" : return btoa(obj);                               break;
            default : return ""; break;
        }
    }
    , tileClickEffectSelector: function(cls=null){
        if(!cls) return;
        $(cls).on("click",function(e){
            if(this.classList.contains("-skip")) return;
            let
            size = Math.max(this.offsetWidth, this.offsetHeight);
            this.append(app.new("span","-absolute",{
                background      : app.colors().CLR_DARK1
                , display       : "inline-block"
                , borderRadius  : "50%"
                , width         : size+"px"
                , height        : size+"px"
                , transform     : "scale(0)"
                , opacity       : 0
                , top           : (e.offsetY - size/2)+"px"
                , left          : (e.offsetX - size/2)+"px"
            }, function(){
                this.anime({scale:2,opacity:.5},ANIMATION_LENGTH/2,null,function(){ this.remove(); },"ease-in");
            }));
        }).remClass(cls);
    }
});
app.spy("pragma",function(x){
    app.last = app.current;
    app.current = x;
    if(bootstrap&&!bootstrap.ready()) return setTimeout((x)=>{ app.pragma = x }, ANIMATION_LENGTH, x);
    this.onPragmaChange.fire(x);
});
if(undefined!==SVG){
    SVG.extend(SVG.Text, {
        path: function(d){
            let
            track, path  = new SVG.TextPath;
            if (d instanceof SVG.Path) track = d;
            else track = this.doc().defs().path(d);
            while (this.node.hasChildNodes()) path.node.appendChild(this.node.firstChild);
            this.node.appendChild(path.node);
            path.attr('href', '#' + track, SVG.xlink);
            return this;
        }
    });
}
window.onmousemove = e => mouseAxis = { x: e.clientX, y: e.clientY }
console.log('  __\n\ / _| __ _  __ _ _   _\n\| |_ / _` |/ _` | | | |\n\|  _| (_| | (_| | |_| |\n\|_|  \\__,_|\\__,_|\\__,_|');