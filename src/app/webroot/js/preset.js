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
makeframe = (name=fdate.as(), content='', color=app.pallete.BACKGROUND, role='assistant') => {
    const el = DIV('-row --tile-row ' + (role == 'assistant' ? '--assistant' : '--user'), { padding:'.5em', marginBottom:"2em", color: app.pallete.FONT }).app(
        DIV(`-col-10 ${role == 'assistant' ? '-left' : '-right'}`, { background:color, borderRadius:'.5em' }).app(
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
                    // AMPLIFY
                    DIV('-right -pointer --tooltip', { opacity:.25, padding:'0 .5em' }).app(
                        IMG('assets/img/icons/square.svg', '-inverted -avoid-pointer', { height:'1em', transform:'translateY(-.125em)' })
                    ).data({ tip: 'Visualizar' }).on('click', function(){
                        $('body')[0].app(
                            DIV('-fixed -wrapper --popup', { background:'#000e', zIndex:100000, padding:'2em 24%' }).app(
                                DIV('-wrapper', { background: color, borderRadius:'.5em', padding:".5em" }).app(
                                    DIV("-wrapper -scrolls -content-left", { padding:'1em', background: app.pallete.FONT+'12' }).html(
                                        "<pre class='-row'>"+content+"</pre>"//.split(/\n+/g).filter(i=>i.trim().length).map(i=>i.trim()).join('<br>')
                                    )
                                )
                            ).app(
                                DIV('-absolute -zero-top-right -only-pointer', { margin:'1em calc(24% - 2em)', background: app.pallete.BACKGROUND, borderRadius: '2em' }).app(
                                    IMG('assets/img/icons/cross.svg', '-inverted -avoid-pointer', { height:'4em', width:'4em', padding:'1em' })
                                ).on('click', function(){ this.upFind('--popup').remove() })
                            )
                        )
                    })
                )
            )
        ).app(DIV('-row', { padding: '0 .5em .5em' }).app(
            DIV('-row -content-left -roboto-light -scrolls --message', {
                padding         : '.5em'
                , background    : '@DARK3'
                , borderRadius  : '.5em'
                , maxHeight     : role=='user' ? '20em': null
            }).data({ role, ts: fdate.time() })
        ))
    ) ;;
    el.$('.--message')[0].html(content.split(/\n+/g).filter(i=>i.trim().length).map(i=>i.trim()).join('<br>'))
    $(".--stage")[0].app(el).scrollTop = Number.MAX_SAFE_INTEGER
    app.tooltips()
    return el
}
;;

const
wsport = (location.port + "").slice(0, 2) + (location.port + "").slice(0, 2)
, ws = new WebSocket('ws://' + location.hostname + ':' + wsport)
, socket_callbacks = { }
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
    , error = data?.error
    ;;

    if(error) {
        $(".--progress").forEach(e => e.stop().anime({ width: '100%', background: 'red' }))
        app.error(error)
    }

    if(progress !== undefined) {
        let p = Math.min(progress, 1) * 100 ;;
        $(".--progress").forEach(e => e.stop().anime({ width: p+'%', background: p >= 100 ? 'transparent' : app.pallete.LIME }))
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
            sock(`theme`, { data: { theme: 'dark' }, cb: res => {
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