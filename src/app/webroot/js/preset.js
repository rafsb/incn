const start= true
/*
 *
 * CONFIG
 *
 */
, VERBOSE            = true
, ANIMATION_LENGTH 	 = 400
, AL 				 = ANIMATION_LENGTH
, APP_DEFAULT_THEME  = "dark"
, APP_NEEDS_LOGIN 	 = false

/*
 * ENUMS
 */
, EPaths = Object.freeze({
    API             : "api/"
})

, EPragmas = Object.freeze({
	HOME            : 0
})

, ELocales = Object.freeze({
    BR              : "pt_br"
    , EN            : "en_us"
    , ES            : "es_es"
})
;;

const
ws = new WebSocket('ws://localhost:4000')
, socket_callbacks = {}
, sock = (path, data) => {
    const
    emitter = app.nuid(64).toLowerCase()
    , callback = typeof data == "function" ? data : (data.callback || data.cb)
    , payload = blend(data?.data||{}, { ts: fdate.time(), path, emitter, device: app.device })
    ;;
    if(callback) socket_callbacks[emitter] = callback
    let req ;;
    try { req = JSON.stringify(payload) } catch(e) { if(VERBOSE) console.trace(e) }
    req && ws.send(req)
}
;;

if(VERBOSE) ws.onopen = function() { console.log(`socket connection stablished!`) }
ws.onmessage = function(res) {
    try {
        let data = JSON.parse(res.data) ;;
        try { data.data = JSON.parse(data.data) } catch(e) { }
        socket_callbacks[data.emitter](data?.data)
    } catch(e) {
        if(VERBOSE) console.trace(res, e)
    }
}

app.loading()

/**
 * LET THERE BE MAGIC
 */
blend(app, {
    pragma           : { pools: {} }
    , components     : {}
    , caches         : {}
    , flags          : new Set()
    , locale         : app.storage("locale") || app.storage("locale", ELocales.BR)
    , theme          : app.storage("theme") || app.storage("theme", APP_DEFAULT_THEME)
    , device         : app.storage("device") || app.storage("device", app.nuid(32))
    , initial_pragma : EPragmas.HOME
    , onPragmaChange : new pool()
})

bootloader.dependencies = new Set([
    /*
     * Set the components to be loaded before
     * the system boot
     */
    "ready"
])

/*
 * These components are loaded at system boot times
 * the splash screen will let the system procede
 * after this execution queue and all bootloader`s
 * loaders are all done
 */
bootloader.loadComponents.add(async _ => {

    /*** SPLASH ***/
    {
        bootloader.dependencies.add("splash")
        app.load("views/splash.htm")
    }

    /*** VERSION ***/
    {
        bootloader.dependencies.add("v")
        try {
            sock(`version`, res => {
                app.v = res
                if(app.storage('version') != app.v) {
                    app.warning('Atualizando versão de sistema...')
                    app.clearStorage()
                    app.storage('version', app.v)
                    setTimeout(location.reload, AL * 4)
                } else if(VERBOSE) app.success("App version: " + app.v)
            })
        } catch(e) {
            app.warning("Não foi possível verificar a versão atual do sistema, tentaremos trabalhar com as informações que temos!")
            if(VERBOSE) console.trace(e)
        }
        bootloader.ready("v")
    }

    /*** THEME ***/
    {
        bootloader.dependencies.add("theme")
        const paint = _ => [ "background", "foreground" ].map(x => $(".--"+x).css({ background: app.pallete[x.toUpperCase()], color: app.pallete.FONT })) ;;
        try {
            sock(`theme`, { data: { theme: app.theme }, cb: res => blend(app.pallete, res)&&paint() })
        } catch(e) {
            app.warning("Não foi possível carregar o tema escolhido, usaremos o padrão do sistema!")
            if(VERBOSE) console.trace(e)
            paint()
        }
        bootloader.ready("theme")
    }

    /*** PRAGMAS ***/
    for(const prag of Object.values(EPragmas)) {
        bootloader.dependencies.add(`shift-${prag}`)
        app.pragma.pools[prag] = new pool();
        app.pragma.spy(prag, function(value) {
            app.pragma.last = app.pragma.current
            app.pragma.current = prag
            app.pragma.pools[prag].fire(value)
        })
        bootloader.ready(`shift-${prag}`)
    }

    /*** HOME ***/
    {
        bootloader.dependencies.add("home")
        app.load("views/home.htm")
    }

    bootloader.ready("ready")

})

/*
 * This pool will fire after all loaders are true
 */
bootloader.onFinishLoading.add(function() {

    /*
    * commonly used helpers, uncommnt to fire
    */

})

/*
 * a key pair value used for tooltips
 * tooltip() function must be fired to
 * make these hints work
 */
app.hints = {
    // some_id: "A simple tootlip used as example"
}

/*
 * The system will boot with bootloader rules
 * comment to normal initialization without
 * possible system dependencies
 */
initpool.add(_ => bootloader.loadComponents.fire())