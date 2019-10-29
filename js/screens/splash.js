let
splash = $(".--screen.--splash").at().css({background:"@BACKGROUND"}).app(_("div", "-fixed -zero-bottom -row").app(
    _("div","--boot-progress -left", { width:0, background:"@WET_ASPHALT", height:".5em"})
));

app.call("src/img/logos/logo.svg").then(r => {
    if(r.status) r = r.data.morph()[0];
    else return;
    r.get("path").each((me, i) => me.css({
        opacity:0
        , "stroke-dasharray":  me.getTotalLength()
        , "stroke-dashoffset": me.getTotalLength()
        , "stroke": app.colors().WET_ASPHALT
    }, me => {
        me.anime({opacity:1, "stroke-dashoffset":0}, ANIMATION_LENGTH*4, ANIMATION_LENGTH/2*i);
    }));
    splash.pre(r.css({width:"40%"}))
    app.components.logo_svg = r.cloneNode(true)
    setTimeout(() => bootstrap.ready("splash"), ANIMATION_LENGTH*2)
})