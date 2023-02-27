/**************************************************************************
     ___                                             _
    /  _|_ __ __ _ _ __ ___   _____      _____  _ __| | __
    | |_| '__/ _` | '_ ` _ \ / _ \ \ /\ / / _ \| '__| |/ /
    |  _| | | (_| | | | | | |  __/\ V  V / (_) | |  |   <
    |_| |_|  \__,_|_| |_| |_|\___| \_/\_/ \___/|_|  |_|\_\βξπτδ

****************************************************************************/

global.DEBUG             = process.env.DEBUG * 1 || false
global.GAUGE_LEN         = process.stdout.columns || 64;

//       _
//   ___| | __ _ ___ ___  ___  ___
//  / __| |/ _` / __/ __|/ _ \/ __|
// | (__| | (_| \__ \__ \  __/\__ \
//  \___|_|\__,_|___/___/\___||___/
//
class FCallResponse {
    constructor(url=location.href, args={}, method="POST", header={}, data=null){
        this.url = url;
        this.args=args;
        this.method=method;
        this.headers=header;
        this.data=data;
        this.status = this.data ? true : false;
    }
}
;;

class fw {

    initialize(){ this.initpool.fire() }

    static async call(url, args=null, method=null, head=null){
        method = method ? method : (args ? "POST" : "GET")
        const
        o = new Promise(function(accepted,rejected){
            let
            o = new FCallResponse(url, args, method)
            , xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    o.status = xhr.status;
                    o.data = xhr.responseText.trim();
                   return accepted(o);
                };
            }
            xhr.open(method,url);
            xhr.send(args ? args.json() : null);

        });
        return o;
    }

    static async post(url, args, head={ "Content-Type": "application/json;charset=UTF-8" })    {
        return this.call(url, args, "POST", head)
    }

    static nuid(n=32) {
        return fw.iterate(0, n, i => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.ceil(Math.random()*35)]).join('')
    }

    static colors(pallete="light"){
        return pallete&&this.color_pallete[pallete] ? this.color_pallete[pallete] : this.color_pallete;
    }

    static async sleep(time=ANIMATION_LENGTH) {
        return new Promise(function(ok){
            setTimeout(function(){ return ok() }, time)
        })
    }

    static iterate(s, e, fn, step=1) {
        const x = [];
        if(!fn) fn = i => i;
        s = s || 0;
        e = e || s+1;
        for(let i = s; i != e; i += step) x.push(fn(i));
        return x;
    }

    static gauge(x, pre = '', ch = '=', maxwidth=1024) {
        x = x ? Math.max(0, x*1) : .001;
        pre = pre ? `${pre} `: '';
        const
        gaugelen = Math.ceil((Math.min(maxwidth, GAUGE_LEN) - pre.length - 8)*x)
        , filllen = fw.fill(fw.iterate(0, gaugelen, _ => ch+'').join(''), ' ', Math.min(maxwidth, GAUGE_LEN) - pre.length - 8)
        ;;
        process.stdout.write(`\r${pre}[${filllen}]${fw.fill(Math.ceil(x*100), ' ', 5, -1)}%`)
        return `\r${pre}[${filllen}]${fw.fill(Math.ceil(x*100), ' ', 5, -1)}%`
    }

    static rgb2hex(color) {
        let
        hex = "#";
        if(!Array.isArray(color)) color = color.split(/[\s+,.-]/g);
        color.each(clr => {
            let
            tmp = (clr*1).toString(16);
            hex += tmp.length == 1 ? "0" + tmp : tmp;
        })
        return hex.substring(0,9)
    }

    static hex2rgb(color) {
        let
        rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return  rgb ? [ parseInt(rgb[1] || 255, 16), parseInt(rgb[2] || 255, 16), parseInt(rgb[3] || 255, 16), parseInt(rgb[3] || 255, 16) ] : null;
    }

    constructor() {
        this.initial_pragma = 0
        this.current        = 0
        this.last           = 0
        this.initpool       = new Pool()
        this.onPragmaChange = new Pool()
        this.components = {}
        this.prism      = {
            ALIZARIN:"#E84C3D"
            , PETER_RIVER:"#2C97DD"
            , ICE_PINK: "#CA179E"
            , EMERLAND:"#53D78B"
            , SUN_FLOWER:"#F2C60F"
            , AMETHYST:"#9C56B8"
            , CONCRETE:"#95A5A5"
            , WET_ASPHALT:"#383C59"
            , TURQUOISE:"#00BE9C"
            , PURPLE_PINK:"#8628B8"
            , PASTEL: "#FEC200"
            , CLOUDS:"#ECF0F1"
            , CARROT:"#E67D21"
            , MIDNIGHT_BLUE:"#27283D"
            , WISTERIA:"#8F44AD"
            , BELIZE_HOLE:"#2A80B9"
            , NEPHRITIS:"#27AE61"
            , GREEN_SEA:"#169F85"
            , ASBESTOS:"#7E8C8D"
            , SILVER:"#BDC3C8"
            , POMEGRANATE:"#C0382B"
            , PUMPKIN: "#D35313"
            , ORANGE: "#F39C19"
            , BURRO_QNDO_FOJE: "#8C887B"
            , LIME: "#BAF702"
        }
        this.color_pallete = {
            /*** SYSTEM***/
            BACKGROUND : "#FFFFFF"
            , FOREGROUND : "#ECF1F2"
            , FONT : "#2C3D4F"
            , FONTINVERTED: "#F2F2F2"
            , FONTBLURED:"#7E8C8D"
            , SPAN :"#2980B9"
            , DISABLED: "#BDC3C8"
            , DARK1:"rgba(0,0,0,.08)"
            , DARK2:"rgba(0,0,0,.16)"
            , DARK3:"rgba(0,0,0,.32)"
            , DARK4:"rgba(0,0,0,.64)"
            , LIGHT1:"rgba(255,255,255,.08)"
            , LIGHT2:"rgba(255,255,255,.16)"
            , LIGHT3:"rgba(255,255,255,.32)"
            , LIGHT4:"rgba(255,255,255,.64)"
            /*** PALLETE ***/
            , WHITE: "#FFFFFF"
            , BLACK: "#000000"
        }
        binds(this.color_pallete, this.prism);
    }
}
;;

// console.log('  __\n\ / _| __ _  __ _ _   _\n\| |_ / _` |/ _` | | | |\n\|  _| (_| | (_| | |_| |\n\|_|  \\__,_|\\__,_|\\__,_|');
module.exports = fw