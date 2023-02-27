const
express = require('express')
, router = express.Router()
, { Spum, FObject } = require('../lib/fw')
;;

// router.get("/account", (_, res) => res.send("ok"))

router.all("*", async (req, res, next) => {

    var path = (req.params && req.params[0] ? req.params[0] : '').split('/').filter(e => e);
    if (/robots.*\.txt$/gi.test(path.join('/'))) res.send('1');
    else {
        try {
            if(!path[0]) res.send({ status: NOT_SET, error: 'missing arguments' })
            else {

                const
                cls = path[0].slice(0, 1).toUpperCase() + path[0].slice(1)
                , action = path[1] || 'init'
                , final = require(EPaths.WEBCONTROLLERS + cls.toLowerCase())
                ;;

                var tmp_args = Spum.blend({}, req.query, req.body) ;;
                tmp_args.argv = path.slice(3)

                const
                b64 = tmp_args.encoded ? tmp_args.encoded.replace(/\s+/gi, '+') : ''
                // , u8 = b64 ? atob(b64).toString('utf8') : null
                , u8 = b64 ? Buffer.from(b64, 'base64').toString('utf8') : null
                ;;

                tmp_args.decoded = u8 && u8 != 'undefined' ? JSON.parse(u8) : null;
                tmp_args = Spum.blend(tmp_args, tmp_args.decoded)
                delete tmp_args.decoded

                tmp_args.session = FObject.cast(req.session)

                var result = final[action](FObject.cast(tmp_args)) ;;
                if (result instanceof Promise) result = await result;

                res.send(result)
            }
        } catch (e) {
            err(`api`, `*`, path + " / " + e.toString())
            if(VERBOSE>3) console.trace(e)
            res.send("")
        }
    }
})

module.exports = router