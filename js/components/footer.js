let
footer = { 
    ready: null
    , count: 5
    , node: $("body>footer").at().css({opacity:0}, me => me.anime({opacity:1, background:"@FOREGROUND"})) 
}
, icon_tile = _("nav", "-only-pointer -col-3 -tile --footer-icon-tile");

footer.spy("ready",function(){ if(!--this.count) bootstrap.ready("footer_icons") })

async function loadicon(name, pragma){
    return app.call("src/img/icons/"+name+".svg").then(svg=>{
        svg = svg.data.morph().css({padding:"1em", height:"4.05em"})[0];
        svg.get("path").css({fill:"@WET_ASPHALT"});
        footer.node.app(icon_tile.cloneNode(true).data({pragma:pragma}).app(svg));
        footer.ready = true;
    })
}

loadicon("rss", FEED).then(_=>{
    loadicon("network", SOCIAL).then(_=>{
        loadicon("search", SEEK).then(_=>{
            loadicon("bell" , NOTIFICATION).then(_=>{
                loadicon("menu", MENU).then(_=>{
                    $(".--footer-icon-tile").on("click",function(){ app.pragma = this.dataset.pragma })&&bootstrap.ready("footer")
                })
            })
        })
    })
})