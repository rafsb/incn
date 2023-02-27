const
fs = require("fs")
, os = require('os')
, fobject = require('./fobject')
, farray = require('./farray')
;;

if(!global.EIO) global.EIO = Object.freeze({
    REPLACE: 0
    , APPEND: 1
    , MAX_LOG_LINES: 1024
})

if(!global.EIOErrors) global.EIOErrors = Object.freeze({
    PATH_MISSING:   -1
    , OBJ_MISSING:  -2
    , PATH_BROKEN:  -3
})

module.exports = class __io {
    static root(path=null){
        if(path && (path[0] == "/" || path.match(/\b[a-zA-Z]{1}:.*/gi))) return path;
        return ROOT + (path || '')
    }

    static exists(f){
        return fs.existsSync(__io.root(f))
    }

    static read(f){
        var tmp = "";
        f = __io.root(f);
        if(f && fs.existsSync(f)) tmp = fs.readFileSync(f, "utf8").trim();
        return tmp;
    }

    static write(f, content, mode=EIO.REPLACE){
        f = __io.root(f)
        var tmp = f.split(/\//g);
        tmp = tmp.slice(0,tmp.length-1)
        if(!fs.existsSync(tmp)) __io.mkd(tmp.join("/"))
        tmp = (mode == EIO.APPEND && fs.existsSync(f) ? __io.read(f) + "\n" : "") + content
        fs.writeFileSync(f, tmp)
        return fs.existsSync(f)
    }

    static jin(path=null, obj=null, mode=EIO.REPLACE){
        try {
            if(path===null) return EIOErrors.PATH_MISSING
            if(obj===null) return EIOErrors.OBJ_MISSING
            return __io.write(path, JSON.stringify(obj, null, 4), mode);
        } catch(e){
            if(VERBOSE>=2) console.trace(e);
            return false
        }
    }

    static jout(path){
        try {
            const tmp = JSON.parse(__io.read(path)) ;;
            return Array.isArray(tmp) ? farray.cast(tmp) : fobject.cast(tmp)
        } catch(e){
            if(VERBOSE>3) console.trace(e);
            return false
        }
    }

    static log(content, f="debug", mode = EIO.APPEND)
    {
        var tmp = [], offset ;
        f = "var/logs/" + f + (f.indexOf('.log') + 1 ? '' : '.log');
        if(fs.existsSync(__io.root(f))){
            tmp = mode == EIO.APPEND ? __io.read(f) : null
            if(tmp) tmp = tmp.split(/\n/g)
            else tmp = []
        }
        tmp.push(content);
        offset = tmp.length - EIO.MAX_LOG_LINES;
        tmp = tmp.slice(offset > 0 ? offset : 0, EIO.MAX_LOG_LINES).join('\n');
        __io.write(f, tmp, EIO.REPLACE);
        return content
    }

    static scan(folder=null,extension=null, withfolders=true)
    {
        if(folder===null || !fs.existsSync(__io.root(folder))) return new farray();
        var
        tmp = fs.readdirSync(__io.root(folder))
        , result = new farray()
        ;;
        if(tmp){
            tmp.forEach(t => {
                if(!(t=="." || t=="..")){
                    if(extension){
                        if(t.substr(extension.length*-1) == extension) result.push(t);
                    }
                    else if(withfolders || !fs.lstatSync(folder + "/" + t).isDirectory()) result.push(t);
                }
            })
        }
        return result;
    }

    static files(path,ext=null)
    {
        return __io.scan(path,ext,false);
    }

    static folders(path)
    {
        var
        arr = new farray()
        , tmp = __io.scan(path, null, true)
        ;;
        if(tmp.length) tmp.forEach(f => { if(fs.lstatSync(__io.root(`${path}/${f}`)).isDirectory()) arr.push(f) });
        return arr;
    }

    static rmf(dir=null){
        dir = __io.root(dir)
        try {
            fs.rmSync(dir, { recursive: true })
        } catch(e) {
            err('__io', 'rmf', e.toString())
            if(VERBOSE>3) console.trace(e)
        }
        return !fs.existsSync(dir)
    }

    static mkd(dir){
        fs.mkdirSync(__io.root(dir), { recursive: true })
        return fs.existsSync(dir)
    }

    static tmp()
    {
        return fs.mkdtempSync(os.tmpdir(), "fa-")
    }

    static rm(p=null)
    {
        if(p===null) return EIOErrors.PATH_MISSING;
        p = __io.root(p);
        if(fs.existsSync(p)) fs.unlinkSync(p);
        return !fs.existsSync(p)
    }

    static cpr(f,t)
    {
        if(!f||!t) return EIOErrors.PATH_MISSING;

        f = __io.root(f)
        t = __io.root(t)

        if(!fs.existsSync(f)) return EIOErrors.PATH_BROKEN;
        if(!fs.existsSync(f)) fs.mkdirSync(t)

        if(fs.lstatSync(f).isDirectory()) {
            fs.readdirSync(f).forEach(file => {
                if(fs.lstatSync(f + "/" + file).isDirectory()) __io.cpr(f + "/" + file, t );
                else fs.copyFileSync(f + "/" + file, t);
            })
        }
    }

    static mv(f,t)
    {
        if(!f||!t) return EIOErrors.PATH_MISSING;
        f = __io.root(f)
        t = __io.root(t)
        return fs.renameSync(f, t)
    }

}