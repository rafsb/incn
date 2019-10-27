app.components.row = _("nav","-row -tile -content-left",{
    padding:".5em"
    , borderRadius: ".2em"
    , background:"@FOREGROUND"
    , color: "@FONT"
    , marginBottom:".5em"
}).app(_("div","-row -ellipsis --content").text("row[.--content]: a single line with ellipsis"))

app.components.setrow = _("nav","-row -tile -content-left",{
    padding:".5em"
    , borderRadius: ".2em"
    , background:"@FOREGROUND"
    , color: "@FONT"
    , marginBottom:".5em"
}).app(
    _("div","-row -left -ellipsis",{ width:"calc(100% - 3em)" }).text("setrow[.--content, .--switch]: a single line switches")
).app(
    _("div", "-absolute -zero-tr --switch", { height:"2.5em", width:"2.5em", padding:".25em", marginRight:".25em" }).attr({state:1})
)

app.call("src/img/switch.svg").then(swit=>{
    if(swit.data){
        swit = swit.data.morph()[0];
        swit.get(".--color").css({ fill: "@EMERALD" }).data({state:1});
        app.components.setrow.get(".--switch").at().app(swit);
    }
})

bootstrap.ready("row_tile")