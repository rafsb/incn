$(".--screen.--seek").at().css({background:"@WET_ASPHALT"})
    .app(_("b", "-absolute -zero -row", { padding:"1.5em", color:"@CLOUDS", opacity:.5}).text("BUSCA"))
    .app(
        _("div", "-absolute -pointer -tile -zero-tr --screen-nav-back")
            .app(_("img").css({height:"4em",padding:"1.5em", filter:"invert(1)"}).attr({src:"src/img/icons/cross.svg"}))
    )
    .app(_("section","-wrapper -scrolls"))&&bootstrap.ready("seek")