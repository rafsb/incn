const
router = require('express').Router()
, io   = require('../lib/utils/fio')
;;

router.get('/dictionary/:locale', (req, res) => {
    let ret ;;
    try { ret = io.jout(`app/webroot/assets/locales/${req.params.locale}.json`) } catch(e) { ret = {} }
    res.json(ret)
})

router.get('/theme/:theme', (req, res) => {
    let ret ;;
    try { ret = io.jout(`app/webroot/assets/themes/${req.params.theme}.theme`) } catch(e) { ret = {} }
    res.json(ret)
})

router.get('/version', (req, res) => {
    res.send(process.env.VERSION||"0.0.1-alpha")
})

module.exports = router