$(".--screen.--feed").at().css({background:"@WET_ASPHALT", padding:"0 .5em"})
    .app(_("b", "-absolute -zero -row", { padding:"1.5em", color:"@CLOUDS", opacity:.5}).text("RSS"))
    .app(
        _("div", "-absolute -pointer -tile -zero-tr --screen-nav-back")
            .app(_("img").css({height:"4em",padding:"1.5em", filter:"invert(1)"}).attr({src:"src/img/icons/cross.svg"}))
    )
    .app(_("section","-row -scrolls --stage",{top:"4em", height:"calc(100% - 8.05em)"}))&&bootstrap.ready("feed")