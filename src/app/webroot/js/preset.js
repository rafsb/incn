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
makeframe = (name=fdate.as(), content=' ', color=app.pallete.BACKGROUND, role='assistant') => {
    const el = DIV('-row --tile-row', { padding:'.5em', marginBottom:"2em", color: app.pallete.FONT }).app(
        DIV(`-col-8 -${role == 'assistant' ? 'left' : 'right'}`, { background:color, borderRadius:'.5em' }).app(
            TAG('header', '-row -content-left', { padding:'.5em' }).app(SPAN(name, '-left', { opacity:.25 })).app(
                TAG('nav', '-absolute -zero-top-right', { padding:'.5em' }).app(
                    // REMOVE
                    DIV('-right -pointer --tooltip', { padding:'0 .5em' }).app(
                        IMG('assets/img/icons/cross.svg', '-inverted -avoid-pointer', { height:'1em', transform:'translateY(-.125em)' })
                    ).data({ tip: 'Remover frame' }).on('click', function(){ this.upFind('--tile-row').remove() })
                ).app(
                    // COPY2CLIP
                    DIV('-right -pointer --tooltip', { padding:'0 .5em', opacity:.32 }).app(
                        IMG('assets/img/icons/file.svg', '-inverted -avoid-pointer', { height:'1em', transform:'translateY(-.125em)' })
                    ).data({ tip: 'Clique para copiar o conteúdo!' }).on('click', function() { fw.copy2clipboard(content); app.success('Conteúdo copiado com sucesso') })
                ).app(
                    // SUMMARIZE
                    DIV('-right --tooltip', { opacity:.25, cursor:'not-allowed', padding:'0 .5em' }).app(
                        IMG('assets/img/icons/gas.svg', '-inverted -avoid-pointer', { height:'1em', transform:'translateY(-.125em)' })
                    ).data({ tip: 'Sumarize' }).on('click', function(){ return app.warning('WIP'); sock('summarize', { data: { text: content }, cb: res => {
                        console.log(res)
                        if(res?.data?.text) makeframe(name, res.data.text)
                        else fw.error('error summarizing')
                    } }) })
                )
            )
        ).app(DIV('-row', { padding: '0 .5em .5em' }).app(
            DIV('-row -content-left -roboto-light --message', { padding:'.5em', background:'@DARK3', borderRadius:'.5em' }).data({ role, content, ts: fdate.time() })
        ))
    ) ;;
    el.$('.--message')[0].html(content.trim().replace(/\n/gui, '<br/>'))
    $(".--stage")[0].app(el).scrollTop = Number.MAX_SAFE_INTEGER;
    app.tooltips()
    return el
}
;;

const
ws = new WebSocket('ws://localhost:4000')
, socket_callbacks = {}
, sock_sender = req => {
    if(ws.readyState === 1) ws.send(req)
    else setTimeout(_ => sock_sender(req), AL/2)
}
, sock = (path, data) => {
    const
    callback = typeof data == "function" ? data : (data.callback ?  data.callback : data.cb)
    , emitter = callback ? "fn" + callback.toString().hash() : null
    , payload = blend(data?.data||{}, { ts: fdate.time(), path, emitter, device: app.device })
    ;;
    if(callback) socket_callbacks[emitter] = callback
    let req ;;
    try { req = JSON.stringify(payload) } catch(e) { if(VERBOSE) console.trace(e) }
    sock_sender(req)
}
;;

if(VERBOSE) ws.onopen = function() { console.log(`socket connection stablished!`) }
ws.onmessage = function(res) {
    try { res = JSON.parse(res.data) } catch(e) { res = res.data }
    const
    stream = res.stream
    , progress = res.progress
    , data = typeof res == 'string' ? res : res.data
    ;;

    if(progress !== undefined) {
        let p = Math.min(progress, 1) * 100 ;;
        $(".--progress").forEach(e => e.anime({ width: p+'%' }).then(e => p==100 ? e.css({ width:0 }) : null))
    }

    if(stream !== undefined) {
        const target = $(".--stream")[0] ;;
        if(target) target.app(DIV('-row -content-left -ellipsis --tooltip').html(fdate.as('Y-m-d_h:i:s')+" -> "+stream.replace(/\n/gui, '<br/>')).data({ tip: stream })).scrollTop = Number.MAX_SAFE_INTEGER
    }

    if(res.emitter && socket_callbacks[res.emitter]) Promise.resolve(socket_callbacks[res.emitter](data))

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
        await app.load("views/splash.htm")
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
                bootloader.ready("v")
            })
        } catch(e) {
            app.warning("Não foi possível verificar a versão atual do sistema, tentaremos trabalhar com as informações que temos!")
            if(VERBOSE) console.trace(e)
        }
    }

    /*** THEME ***/
    {
        bootloader.dependencies.add("theme")
        const paint = _ => [ "background", "foreground" ].map(x => $(".--"+x).css({ background: app.pallete[x.toUpperCase()], color: app.pallete.FONT })) ;;
        try {
            sock(`theme`, { data: { theme: app.theme }, cb: res => {
                blend(app.pallete, res)
                paint()
                bootloader.ready("theme")
            } })
        } catch(e) {
            app.warning("Não foi possível carregar o tema escolhido, usaremos o padrão do sistema!")
            if(VERBOSE) console.trace(e)
            paint()
        }
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

    bootloader.ready("ready")

})

/*
 * This pool will fire after all loaders are true
 */
bootloader.onFinishLoading.add(function() {

    /*
    * commonly used helpers, uncommnt to fire
    */

    /*** HOME ***/
    {
        bootloader.dependencies.add("home")
        app.load("views/home.htm")
    }

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