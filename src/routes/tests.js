const
router = require('express').Router()
, utils = '../lib/utils/'
, fw = require('../lib/fw')
, io   = require(utils + 'fio')
, fobj = require(utils + 'fobject')
, fstr = require(utils + 'fstr')
;;

router.get('/fstr/:param', (req, res) => {
    let ret ;;
    const args = fobj.blend(req.params, req.query, req.body) ;;
    { // MAGIC
        ret = fstr.json({args})
    }
    res.send(ret)
})

module.exports = router