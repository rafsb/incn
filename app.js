process.env.UV_THREADPOOL_SIZE = require('os').cpus().length * 2

require('dotenv').config({ path: `./.env` })

global.HOST             = process.env.HOST
global.PORT             = process.env.PORT        || 3000
global.VERBOSE          = process.env.VERBOSE * 1 || 0
global.VERSION          = process.env.VERSION     || "0.0.1-alpha"
global.DB_DRIVER        = process.env.DB_DRIVER   || "fstore"
global.DB_NAME          = process.env.DB_NAME     || "core"
global.DB_PK            = process.env.DB_PK       || "part"
global.DB_KEY           = process.env.DB_KEY      || ""
global.DB_ENDPOINT      = process.env.DB_ENDPOINT || ""
global.SESSION_DURATION = process.env.SESSION_DURATION || 24 * 60
global.ROOT             = __dirname + '/src/'

const
io          = require('./src/lib/utils/fio')
, fstr     = require('./src/lib/utils/fstr')
, fdate     = require('./src/lib/utils/fdate')
, express   = require('express')
, parser    = require('body-parser')
, app       = express()
;;

global.KEY = io.read('/etc/keys/private.key')
require('./src/lib/constants');

console.log()
console.log(fstr.fill("", "-", Math.min(process.stdout.columns, 64)))
console.log(
    ETerminalColors.BOLD + ' ENV VARS: \n   ' + ETerminalColors.BOLD_OFF
    + io.read("../.env")
        .trim()
        .split(/\n/g)
        .filter(line => line.split('#')[0])
        .map(line => ETerminalColors.FT_BLUE + line.replace('=', ETerminalColors.FT_BLACK+'='+ETerminalColors.BOLD + ETerminalColors.FT_WHITE) + ETerminalColors.BOLD_OFF + ETerminalColors.RESET)
        .join("\n   ")
)
console.log(fstr.fill("", "-", Math.min(process.stdout.columns, 64)))
console.log()

// *---------------------------------------------------*
// *                 session settings                  *
// *---------------------------------------------------*
app.set('trust proxy', 1)
// app.use(cookieParser());
app.use(parser.urlencoded({ extended: true, limit: '20mb' }))
app.use(parser.json({ limit: '20mb' }))

// *---------------------------------------------------*
// *                 router settings                   *
// *---------------------------------------------------*
app.use(express.static(ROOT + 'app/webroot'))
app.set('views', ROOT + 'app/webroot/views')
app.use('/', require('./src/routes/entrypoint'))

app.keepAliveTimeout = 0

// *---------------------------------------------------*
// *                 server settings                   *
// *---------------------------------------------------*
try {
    require('./src/lib/utils/fsocket')
    require("http").createServer(app).listen(PORT)
    console.log(
        ETerminalColors.BG_BLUE
        + ETerminalColors.FT_WHITE
        + ' >>> SERVER RUNNING ON PORT/SOCKET ' + PORT + '/' + SOCKET + ' at ' + fdate.as() + ' <<< '
        + ETerminalColors.RESET
    )
} catch (e) {
    console.error(`error`, `server`, `create`)
    if(VERBOSE>2) console.trace(e)
}