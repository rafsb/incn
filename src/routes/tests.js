const
router  = require('express').Router()
, utils = '../lib/utils/'
, fw    = require('../lib/fw')
, io    = require(utils + 'fio')
, fobj  = require(utils + 'fobject')
, ftext = require(utils + 'ftext')
;;

router.get('/ftext/:param', (req, res) => {
    let ret ;;
    const args = fobj.blend(req.params, req.query, req.body) ;;
    { // MAGIC
        ret = ftext.json({args})
    }
    res.send(ret)
})

module.exports = router