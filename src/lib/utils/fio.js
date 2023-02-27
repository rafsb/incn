/*---------------------------------------------------------------------------------------------
 * fio
 *--------------------------------------------------------------------------------------------*/

const
fs = require("fs")
, os = require('os')
, { fObject, fArray } = require('../fw')
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

module.exports = class fio {
    static root(path=null){
        if(path && (path[0] == "/" || path.match(/\b[a-zA-Z]{1}:.*/gi))) return path;
        return ROOT + (path || '')
    }

    static exists(f){
        return fs.existsSync(fio.root(f))
    }

    static read(f){
        var tmp = "";
        f = fio.root(f);
        if(f && fs.existsSync(f)) tmp = fs.readFileSync(f, UTF8).trim();
        return tmp;
    }

    static write(f, content, mode=EIO.REPLACE){
        f = fio.root(f)
        var tmp = f.split(/\//g);
        tmp = tmp.slice(0,tmp.length-1)
        if(!fs.existsSync(tmp)) fio.mkd(tmp.join("/"))
        tmp = (mode == EIO.APPEND && fs.existsSync(f) ? fio.read(f) + "\n" : "") + content
        fs.writeFileSync(f, tmp)
        return fs.existsSync(f)
    }

    static jin(path=null, obj=null, mode=EIO.REPLACE){
        try {
            if(path===null) return EIOErrors.PATH_MISSING
            if(obj===null) return EIOErrors.OBJ_MISSING
            return fio.write(path, JSON.stringify(obj, null, 4), mode);
        } catch(e){
            if(VERBOSE>=2) console.trace(e);
            return false
        }
    }

    static jout(path){
        try {
            const tmp = JSON.parse(fio.read(path)) ;;
            return Array.isArray(tmp) ? fArray.cast(tmp) : fObject.cast(tmp)
        } catch(e){
            if(VERBOSE>3) console.trace(e);
            return false
        }
    }

    static log(content, f="debug", mode = EIO.APPEND)
    {
        var tmp = [], offset ;
        f = "var/logs/" + f + (f.indexOf('.log') + 1 ? '' : '.log');
        if(fs.existsSync(fio.root(f))){
            tmp = mode == EIO.APPEND ? fio.read(f) : null
            if(tmp) tmp = tmp.split(/\n/g)
            else tmp = []
        }
        tmp.push(content);
        offset = tmp.length - EIO.MAX_LOG_LINES;
        tmp = tmp.slice(offset > 0 ? offset : 0, EIO.MAX_LOG_LINES).join('\n');
        fio.write(f, tmp, EIO.REPLACE);
        return content
    }

    static scan(folder=null,extension=null, withfolders=true)
    {
        if(folder===null || !fs.existsSync(fio.root(folder))) return new fArray();
        var
        tmp = fs.readdirSync(fio.root(folder))
        , result = new fArray()
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
        return fio.scan(path,ext,false);
    }

    static folders(path)
    {
        var
        arr = new fArray()
        , tmp = fio.scan(path, null, true)
        ;;
        if(tmp.length) tmp.forEach(f => { if(fs.lstatSync(fio.root(`${path}/${f}`)).isDirectory()) arr.push(f) });
        return arr;
    }

    static rmf(dir=null){
        dir = fio.root(dir)
        try {
            fs.rmSync(dir, { recursive: true })
        } catch(e) {
            err('fio', 'rmf', e.toString())
            if(VERBOSE>3) console.trace(e)
        }
        return !fs.existsSync(dir)
    }

    static mkd(dir){
        fs.mkdirSync(fio.root(dir), { recursive: true })
        return fs.existsSync(dir)
    }

    static tmp()
    {
        return fs.mkdtempSync(os.tmpdir(), "fa-")
    }

    static rm(p=null)
    {
        if(p===null) return EIOErrors.PATH_MISSING;
        p = fio.root(p);
        if(fs.existsSync(p)) fs.unlinkSync(p);
        return !fs.existsSync(p)
    }

    static cpr(f,t)
    {
        if(!f||!t) return EIOErrors.PATH_MISSING;

        f = fio.root(f)
        t = fio.root(t)

        if(!fs.existsSync(f)) return EIOErrors.PATH_BROKEN;
        if(!fs.existsSync(f)) fs.mkdirSync(t)

        if(fs.lstatSync(f).isDirectory()) {
            fs.readdirSync(f).forEach(file => {
                if(fs.lstatSync(f + "/" + file).isDirectory()) fio.cpr(f + "/" + file, t );
                else fs.copyFileSync(f + "/" + file, t);
            })
        }
    }

    static mv(f,t)
    {
        if(!f||!t) return EIOErrors.PATH_MISSING;
        f = fio.root(f)
        t = fio.root(t)
        return fs.renameSync(f, t)
    }

}