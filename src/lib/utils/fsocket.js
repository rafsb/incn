/*---------------------------------------------------------------------------------------------
 * fsocket
 *--------------------------------------------------------------------------------------------*/

global.SOCKET = process.env.SOCKET || 9000

const
ws = require('ws')
, io = require('./fio')
, fobj = require('./fobject')
, sockserver = new ws.Server({ port: SOCKET })
;;

sockserver.on('connection', socket => socket.on('message', async data => {
    data = JSON.parse(data)
    let res = fobj.blend(data, { error: 0 }) ;;
    if(data.path) {
        const
        path = data.path.split(/\//gu)
        , classname = path.splice(0, 1)[0]
        , method = path.length ? path.splice(0, 1)[0] : "init"
        ;;
        if(classname && method) {
            if(io.exists(EPaths.CONTROLLERS + classname + '.js')) {
                const
                cls = require(EPaths.CONTROLLERS + classname)
                , args = fobj.blend(res, { params: path })
                ;;

                let data ;;
                try {
                    data = cls[method](args)
                    if(data instanceof Promise) data = await data
                } catch(e) {
                    if(VERBOSE>2) console.trace(e)
                    res.error =1
                    res.data = `class/method execution failed: ${classname}/${method}`
                }

                res = fobj.blend(res, { classname, method, params: path, data })
            } else {
                res.error = 2
                res.data = `class didn't fount: ${classname}`
            }
        } else {
            res.error = 3
            res.data = `classname or method missing: ${classname}|${method}`
        }
    } else {
        res.error = 4
        res.data = 'path missing'
    }
    socket.send(JSON.stringify(res))
}))

module.exports = sockserver