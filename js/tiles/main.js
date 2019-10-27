app.components.tile = _("div", "-row -tile", { 
    padding:".5em .5em"
    , borderRadius:".25em"
    , boxShadow:"0 0 .5em @DARK2"
    , background:"@FOREGROUND"
    , marginBottom: ".5em"
}).app(
    _("header", "-row", { borderBottom:"1px solid @DARK2" }).app(
        _("b","-left -content-left -ellipsis --title", { width:"calc(100% - 3em)", padding:"1em", fontSize:"1em" }).text("title")
    ).app(
        _("img", "-right --icon", { width:"3em", height:"3em", padding:".75em", opacity:.4}).attr({src:"src/img/icons/hashtag.svg"})
    )
).app(
    _("section","--content -row -content-left", { padding:".5em"}).text(' is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book')
).app(
    _("footer", "-row", { borderTop:"1px solid @DARK2", padding:".5em .5em 0" })
)
bootstrap.ready("main_tile")