/**************************************************************************
  	 ___                                             _
 	/  _|_ __ __ _ _ __ ___   _____      _____  _ __| | __
	| |_| '__/ _` | '_ ` _ \ / _ \ \ /\ / / _ \| '__| |/ /
	|  _| | | (_| | | | | | |  __/\ V  V / (_) | |  |   <
	|_| |_|  \__,_|_| |_| |_|\___| \_/\_/ \___/|_|  |_|\_\


****************************************************************************/
const
RESPONSIVE_TRESHOLD = 1366
, ANIMATION_LENGTH = 800
, DEBUG = true
, SUM       = 0
, MEDIAN    = 1
, HARMONIC  = 2
, REVERSE_PROXY_CLIENT_URI = "https://cors-anywhere.herokuapp.com/";

HTMLInputElement.prototype.up = function(name, path, fn=null, mini=false) {
    let
    ctnr = this.uid()
    , form = new FormData()
    , counter = 0;

    name = name || faau.uid(13);

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
                faau.notify("Ops! Imagem não pode ser carregada, chama o Berts!",["#ff0066","white"]);
                clearInterval(timer);
            }
        }, ANIMATION_LENGTH/10);
    }
    xhr.upload.onerror = function() {
        faau.notify("Ops! Não foi possível subir esta imagem... chama o berts...",["#ff0066","white"]);
    };
    xhr.open("POST", "image/upload");
    xhr.send(form);
}

Element.prototype.anime = function(obj,len=ANIMATION_LENGTH,delay=0,fn=null,trans=null) {
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
    if(fn!==null&&typeof fn=="function") this.dataset.animationFunction = setTimeout(fn.bind(this),len*1000+delay+1);
    else this.dataset.animationFunction = "";
    return this
}

Element.prototype.do = function(ev){ this.dispatchEvent(ev) };

Element.prototype.empty = function(a=null) {
    if(a){ if(typeof a == 'string') a = a.split(',') }
    else a = [];
    this.get("*").each(function() {if(!(a.indexOf(this.tagName)+1)) this.remove()});
    return this
}

Element.prototype.setStyle = function(o=null, fn = null) {
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
    if(fn!==null&&typeof fn=="function") setTimeout(fn.bind(this),16);
    return this
}

Element.prototype.text = function(tx=null) {
    if(tx) this.textContent = tx;
    else return this.textContent;
    return this
};

Element.prototype.html = function(tx=null) {
    if(tx) this.innerHTML = tx;
    else return this.innerHTML;
    return this
};

Element.prototype.setData = function(o=null, fn = null) {
    if (o===null) return this;
    for(let i in o) this.dataset[i] = o[i];
    if(fn!==null&&typeof fn=="function") fn.bind(this)();
    return this;
}

Element.prototype.setText = function(t=null, fn = null) {
    if (t===null) return this;
    this.innerHTML = t;
    if(fn!==null&&typeof fn=="function") fn.bind(this)();
    return this;
}

Element.prototype.setAttr = function(o=null, fn = null) {
    if (o===null) return this;
    for(let i in o) this.setAttribute(i,o[i]);
    if(fn!==null&&typeof fn=="function") fn.bind(this)();
    return this;
}

Element.prototype.aft = function(obj=null) {
    if(obj) this.insertAdjacentElement("afterend",obj);
    return this
}

Element.prototype.bef = function(obj=null) {
    if(obj) this.insertAdjacentElement("beforebegin",obj);
    return this
}

Element.prototype.app = function(obj=null) {
    if(obj) this.insertAdjacentElement("beforeend",obj);
    return this
}

Element.prototype.pre = function(obj=null) {
    if(obj) this.insertAdjacentElement("afterbegin",obj);
    return this
}

Element.prototype.has = function(cls=null) {
    if(cls) return this.classList.contains(cls);
    return false
}

Element.prototype.dataSort = function(data=null,dir="asc") {
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
        all.each(function() { me.app(this) })
    }
    return this
};

Element.prototype.index = function() {
    return [].slice.call(this.parent().children).indexOf(this)-1;
}

Element.prototype.evalute = function() {
    this.get("script").each((x)=>{ eval(x.textContent) })
};

HTMLInputElement.prototype.setValue = function(v="") {
    this.value = v;
    return this
}

// returns a String encrypted, ex.: "rafael".hash()
String.prototype.hash = function() {
    let
    h = 0, c = "", i = 0, j = this.length;
    if (!j) return h;
    while (i++ < j) {
        c = this.charCodeAt(i - 1);
        h = ((h << 5) - h) + c;
        h |= 0;
    }
    return Math.abs(h).toString();
};

// returns a String encrypted, ex.: "rafael".hash()
String.prototype.json = function() {
    let
    result = null;
    try{
        result = JSON.parse(this);
    } catch(e) {
        // statements
        console.log(e);
    }
    return result;
};

/*
==> Transmute an ordinary string into an html elemnt */
String.prototype.morph = function() {
    let
    x = document.createElement("div");
    x.innerHTML = this.replace(/\t+/g, "").trim();
    return x.firstChild;
};

Element.prototype.on = function(action,fn,passive=true) {
    this.addEventListener(action,fn, {passive:passive})
    return this
};

Element.prototype.parent = function(pace=1) {
    let
    tmp = this;
    while(pace--) tmp = tmp.parentElement;
    return tmp;
}

Element.prototype.inPage = function() {
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
};

/*
==> Make a container element with overflow-y's scrollable scrolls to a given 'el' element */
Element.prototype.scrollTo = function(el,fn=null) {
    if (!el) return -1;
    let
    length = 0;
    do {
        length += el.offsetTop;
        el = el.parentElement;
    } while (el.uid() != this.uid());
    this.scroll({top:length,behavior:"smooth"});
    fn&&fn();
};

Element.prototype.stopScroll = function() {
    this.scroll({top:this.scrollTop+1});
}

Element.prototype.get = function(el) {
	if(el) return this.querySelectorAll(el);
	else return this;
}


Element.prototype.remClass = function(c) {
    if (this.classList.contains(c)) {
        this.classList.remove(c);
    }
    return this;
};

Element.prototype.addClass = function(c) {
    let
    tmp = c.split(/\s+/g), i=tmp.length;
    while(i--) this.classList.add(tmp[i]);
    return this;
};

Element.prototype.toggleClass = function(c) {
    let
    tmp = c.split(/\s+/g), i=tmp.length;
    while(i--) {
      if (tmp[i]) {
        if(!this.classList.contains(tmp[i]))
          this.classList.add(tmp[i]); else this.classList.remove(tmp[i]);
        }
      } return this;
};

Element.prototype.uid = function(name=null) {
	if(name) this.id = name;
	if(!this.id) this.id = faau.nuid(8);
	return this.id;
}

Element.prototype.move = function(obj,len=ANIMATION_LENGTH, anim="linear") {
    len /= 1000;
    this.style.transition = "all "+len+"s "+anim;
    if(obj.top!==undefined)this.style.transform = "translateY("+(this.offsetTop-obj.top)+")";
    if(obj.left!==undefined)this.style.transform = "translateY("+(this.offsetLeft-obj.left)+")";
}

Element.prototype.appear = function(len = ANIMATION_LENGTH) {
    this.setStyle({transition:"none",display:'inline', opacity:0});
    this.anime({opacity:1},len);
}

Element.prototype.desappear = function(len = ANIMATION_LENGTH, remove = false) {
    this.anime({opacity:0},len,0,function() { if(remove) this.remove(); else this.style.display = "none" });
}

Element.prototype.remove = function() { this&&this.parent()&&this.parent().removeChild(this) }

Element.prototype.at = function(i=0) {
    return this.nodearray.at(i)
};

Array.prototype.clone = function() {
    return this.slice(0);
};

Array.prototype.each = function(fn) { if(fn) { for(let i=0;i++<this.length;) fn.bind(this[i-1])(i-1); } return this }

Array.prototype.calc = function(type=SUM){
    let
    res = 0;
    switch (type){
        case (SUM): this.each(function(){ res+=this*1 }); break;
        case (MEDIAN): this.each(function(){ res+=this*1 }); res = res/this.length; break;
        case (HARMONIC): this.each(function(){ res+=1/this*1 }); res = this.length/res; break;
    }
    return res;
};

Array.prototype.not = function(el) { if(this.indexOf(el)+1) { return (this.splice(0,this.indexOf(el))+","+this.splice(this.indexOf(el)+1)).split(",") } }

Array.prototype.last = function() { return this.length ? this[this.length-1] : null; }

Array.prototype.first = function() { return this.length ? this[0] : null; }

Array.prototype.at = function(n=0) { return this.length>=n ? this[n] : null; }

Array.prototype.setStyle = function(obj,fn=null) {
    this.each(function() {this.setStyle(obj,fn)});
    return this
}

Array.prototype.setData = function(txt,fn=null) {
    this.each(function() {this.setText(txt,fn)});
    return this
}

Array.prototype.setText = function(obj,fn=null) {
    this.each(function() {this.setData(obj,fn)});
    return this
}

Array.prototype.addClass = function(cl=null) {
    if(cl) this.each(function() {this.addClass(cl)});
    return this
}

Array.prototype.remClass = function(cl=null) {
    if(cl) this.each(function() {this.remClass(cl)});
    return this
}

Array.prototype.toggleClass = function(cl=null) {
    if(cl) this.each(function() {this.toggleClass(cl)});
    return this
}

Array.prototype.remove = function() {
    this.each(function() {this.parentElement.removeChild(x)});
    return this
}
Array.prototype.setValue = function(v='') {
    this.each(function(){this.value=v});
    return this
}

Array.prototype.stringify = function() {
    return JSON.stringify(this);
};

Object.prototype.stringify = function() {
    return JSON.stringify(this);
};

NodeList.prototype.array = function() {
    return [].slice.call(this)
};

NodeList.prototype.empty = function() {
    return this.each(function(){ this.empty() })
};

NodeList.prototype.not = function(el) {
    let
    arr = [];
    return !this.each(function() { if(this!=el) arr.push(this) }) || arr
};

NodeList.prototype.each = function(fn) {
	if(fn) this.array().each(fn);
    return this
};

NodeList.prototype.desappear = function(len=null,rem=null) {
    this.each(function() { this.desappear(len,rem) })
};

NodeList.prototype.on = function(act=null,fn=null) {
    if(act&&fn)this.each(function(){ this.on(act,fn) });
    return this
};

NodeList.prototype.first = function() { return this.length&&this[0] }

NodeList.prototype.last = function() { return this.length&&this[this.length-1] }

NodeList.prototype.at = function(n=0) { return (this.length>=n)&&this[n] }

NodeList.prototype.anime = function(obj,len=ANIMATION_LENGTH,delay=0,fn=null,trans=null) {
    this.each(function() {this.anime(obj,len,delay,fn,trans)});
    return this
}

NodeList.prototype.setStyle = function(obj,fn=null) {
    this.each(function() {this.setStyle(obj,fn)});
    return this
}

NodeList.prototype.setData = function(obj,fn=null) {
    this.each(function() {this.setData(obj,fn)});
    return this
}

NodeList.prototype.setText = function(txt,fn=null) {
    this.each(function() {this.setData(txt,fn)});
    return this
}

NodeList.prototype.addClass = function(cl=null) {
    if(cl) this.each(function() {this.addClass(cl)});
    return this
}

NodeList.prototype.remClass = function(cl=null) {
    if(cl) this.each(function() {this.remClass(cl)});
    return this
}

NodeList.prototype.toggleClass = function(cl=null) {
    if(cl) this.each(function() {this.toggleClass(cl)});
    return this
}

NodeList.prototype.remove = function() {
    this.each(function() {this.remove()});
    return this
}

NodeList.prototype.setValue = function(v='') {
    this.each(function() {this.value = v});
    return this
}

HTMLCollection.prototype.each = function(fn) {
    if(fn) this.array().each(fn);
    return this
}

HTMLCollection.prototype.array = function() {
    return [].slice.call(this)
};

HTMLCollection.prototype.setValue = function(v='') {
    this.each(function() {this.value = v});
    return this
}

HTMLFormElement.prototype.json = function() {
    let
    json = {};
    this.get("input, select, textarea").each(function(i) {
        if(!this.has('-skip')) json[this.name] = (this.tagName.toUpperCase()=="TEXTAREA"&&this.has("-list") ? this.value.split('\n') : this.value);
    })
    return json
};

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
    fire() {
        let
        pool = this;
        this.execution.each(function(i){ 
            if(typeof this == 'function') setTimeout(this,pool.moment+1,pool.setup);
        });
        return this
    }
    stop(i=null) {
        if(i!==null) { if(this.timeserie[i]) clearInterval(this.timeserie[i]) }
        else this.timeserie.each((i,x)=>{ clearInterval(x) })
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
}

class Swipe {
    constructor(el,len=128) {
        this.len = len;
        this.x = null;
        this.y = null;
        this.e = typeof(el) === 'string' ? $(el).at() : el;

        this.e.on('touchstart', function(v) {
            this.x = v.touches[0].clientX;
            this.y = v.touches[0].clientY;
        }.bind(this));
    }

    left(fn) { this.__LEFT__ = new THROTTLE(fn,this.len); return this }

    right(fn) { this.__RIGHT__ = new THROTTLE(fn,this.len); return this }

    up(fn) { this.__UP__ = new THROTTLE(fn,this.len); return this }

    down(fn) { this.__DOWN__ = new THROTTLE(fn,this.len); return this }

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
        this.e.on('touchmove', function(v) { this.move(v) }.bind(this))
    }
}

/*
 * @class
 *
 * handle the minimum amount of time to wait until executions of a given function
 * good to prevent events like scroll and typing to fire some actions multiple
 * times decreasing performance affecting user's experience
 *
 */
class THROTTLE {
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
}

class FAAU {
	call(url, args=null, fn=false, head=null, method='POST', sync=false) {
        let
        xhr = new XMLHttpRequest();
        args = args ? args : {};
        if(!sync&&fn) {
	        xhr.onreadystatechange = function() {
	            if (xhr.readyState == 4) {
	               return fn.bind({ status: xhr.status, data: xhr.responseText.trim(), url:url, args:args })();
	            };
	        }
	    }
        xhr.open(method, url, !sync);
        // xhr.setRequestHeader("Content-Type", "plain/text");
        // xhr.setRequestHeader("Accept", 'application/json');
        if(head) for(let i in head){ xhr.setRequestHeader(i,head[i]); };
        xhr.send(JSON.stringify(args));
        if(sync) {
            let
            o = { status: xhr.status, data: xhr.responseText.trim(), url:url, args:args };
            return (fn ? fn.bind(o)() : o);
        }
    }

    load(url, args=null, element=null, fn=false, sync=false) {
    	this.call(url, args, function(target=element) {
    		let r;
            if(this.status==200) r = this.data.morph();
            else return DEBUG ? faau.error("error loading "+url) : null;
            if(!r.id) r.id = faau.nuid();
    		let
    		tmp = r.get("script");
    		if(!target) target = faau.get('body')[0];
            target.app(r);
    		if(tmp.length) for(let i=0;i++<tmp.length;) { eval(tmp[i-1].textContent); }
    		if(fn) fn.bind(r)();
            // else faau.get("#"+r.id).first().anime({opacity:1},600);
    	}, sync);
    }

	get(el,scop=null) { return scop ? scop.querySelectorAll(el) : this.nodes.querySelectorAll(el); }

	nuid(n=8) { let a = "FA"; n-=2; while(n-->0) { a+="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('')[parseInt((Math.random()*36)%36)]; } return a; }

    notify(n, c=null) {
        let
        toast = document.createElement("toast");
        toast.setStyle({
            fontSize: "1rem",
            fontFamily: 'OpenSans',
            background: c&&c[0] ? c[0] : "rgba(255,255,255,.8)",
            color: c&&c[1] ? c[1] : "black",
            boxShadow:"0 0 8px gray",
            zIndex:200000,
            display:'block',
            opacity:0,
            position:"fixed"
        }).innerHTML = n ? n : "Hello <b>World</b>!!!";
        if(window.innerWidth>RESPONSIVE_TRESHOLD) {
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
                width:"calc(100% - 4rem)",
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
        notfys = faau.get("toast");

        notfys.each(function(i) { this.anime({ translateY: ( ( toast.offsetHeight + 8 ) * i + 16) + "px", opacity: 1 }, ANIMATION_LENGTH/4) });

        toast.dataset.delay = setTimeout(function() { toast.desappear(ANIMATION_LENGTH/2,true); }, ANIMATION_LENGTH*5);
    }

    loading(show=true){
        if(!show){
            $(".--default-loading").each(function(){ clearInterval(this.dataset.animation); this.remove() });
            return;
        }
        app.body.app(document.createElement("div").addClass("-fixed -view -zero --default-loading"));

        app.fw.load("src/img/loading.svg",null,$(".--default-loading")[0],function(){
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
        faau.notify(message || "Ops! Something went wrong...", ["#7F2B2A","whitesmoke"])
    }
    success(message=null) {
        faau.notify(message || "Hooray! Success!", ["#3CB371","whitesmoke"])
    }

    hintify(n, o={},delall=true,keep=false,special=false,evenSpecial=false) {
        if(delall) $(".--hintifyied"+(evenSpecial?", .--hintifyied-sp":"")).each(function() {this.remove()});

        let
        toast = faau.new("toast");
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
        toast.setStyle(o).addClass("--hintifyied"+(special?"-sp":"")).appendChild(n ? n : ("<b>···</b>!!!").morph());

        if(toast.get(".--close").length) toast.get(".--close").at().on("click",function() { $(".--hintifyied"+(special?", .--hintifyied-sp":"")).remove() });
        else toast.on("click",function() { this.remove() });
        if(!keep) toast.on("mouseleave",function() {$(".--hintifyied"+(special?", .--hintifyied-sp":"")).remove() });

        toast.anime({scale:1,opacity:1});
        $('body')[0].app(toast);
    }

    apply(fn,obj=null) { return (fn ? fn.bind(this)(obj) : null) }

    get(w=null,c=null) { this.nodearray = $(w,c); return this }

    get length() { return this.nodearray.length }

    each(fn=null) {this.nodearray.each(fn);return this }

    at(n=0) { return this.nodearray.at(n) }

    first() {return this.nodearray.first()}

    last() {return this.nodearray.last()}

    empty(except=null) { this.nodearray.each(function() {this.empty(except)})}

    remove() { this.nodearray.each(function() {this.remove()})}

    anime(obj,len=ANIMATION_LENGTH,delay=0,fn=null,trans=null) {
        this.nodearray.each(function() {this.anime(obj,len,delay,fn,trans)})
        return this;
    }

    new(node='div') {
        return document.createElement(node)
    }

    storage(field=null,value=null){
        if(!field) return false;
        if(!value) return window.localStorage.getItem(field);
        window.localStorage.setItem(field,value);
        return true;
    }

    constructor(wrapper,context) {
        this.nodes = document;
        this.nodearray = [];
        if(wrapper) {
            let 
            el = (context ? (typeof context == 'string' ? document.querySelectorAll(context)[0] : context) : document);
            this.nodearray = el ? el.querySelectorAll(wrapper) : [];
        }
    }
}

var
faau = new FAAU(),
$ = function(wrapper=null,context=document) {
    return (new FAAU(wrapper,context)).nodearray;
};

try{
    if(SVG) {
        SVG.extend(SVG.Text, {
            path: function(d) {
                let
                track, path  = new SVG.TextPath;
                if (d instanceof SVG.Path) track = d;
                else track = this.doc().defs().path(d);
                while (this.node.hasChildNodes()) path.node.appendChild(this.node.firstChild);
                this.node.appendChild(path.node);
                path.attr('href', '#' + track, SVG.xlink);
                return this
            }
        });
    }
}catch(e) { console.log(e) }

window.onmousemove = (e) => mouseAxis = { x: e.clientX, y: e.clientY }

window.onresize = function() { ENV.w = window.innerWidth; ENV.h = window.innerHeight;  }

var
mouseAxis = { x:0, y:0 },
initPool = new Pool();

window.ENV = { w:window.innerWidth, h:window.innerHeight, pages: {}, history:[], templates:{}};

console.log('  __\n\ / _| __ _  __ _ _   _\n\| |_ / _` |/ _` | | | |\n\|  _| (_| | (_| | |_| |\n\|_|  \\__,_|\\__,_|\\__,_|');