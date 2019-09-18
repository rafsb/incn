const 
SPLASH   = 0
, HOME   = 1
, FEED   = 2
, SOCIAL = 3
, SEEK   = 4
, NOTIFICATION = 5
, MENU   = 6
;

var
__come = new Event('come')
, __go = new Event('go');

app.hash = app.storage("hash") || "@";
app.body = $("body")[0];
app.initial_pragma = HOME;

bootstrap.loaders = { 
	// screens
	splash: 0
	, home: 0
	, feed: 0
	, social: 0
	, seek: 0
	, notification: 0
	, menu: 0
	// components
	, footer: 0
	, tile:0
	// stuff
	, footer_icons:0
};

app.components = {};

bootstrap.loadComponents.add(function(){
    // screens
    app.load("views/splash.htm", null, $(".--screen.--splash")[0]);
    app.load("views/home.htm",   null, $(".--screen.--home")[0]  );
    app.load("views/feed.htm",   null, $(".--screen.--feed")[0]  );
    app.load("views/social.htm", null, $(".--screen.--social")[0]);
    app.load("views/seek.htm",   null, $(".--screen.--seek")[0]  );
    app.load("views/notification.htm",   null, $(".--screen.--notification")[0]  );
    app.load("views/menu.htm",   null, $(".--screen.--menu")[0]  );

    //components
    app.load("views/components/footer.htm", null, $("body>footer")[0]);
    app.call("views/tiles/main.htm").then(t => { app.components.tile = t.data.prepare(app.colors()).morph()[0]; bootstrap.ready("tile"); });
});

bootstrap.onFinishLoading.add(function(){
	$(".--screen").each(scr => {
		scr
		.on("come",function(){
			if(this.dataset.pragmastate != "shown"){
				this.data({pragmastate:"shown"});
				// this.raise()
				if(this.dataset.hideposx) this.css({display:"inline-block"}, x => x.anime({opacity:1, translateX:0}, null, ANIMATION_LENGTH/4));
				else if(this.dataset.hideposy) this.css({display:"inline-block"}, x => x.anime({opacity:1, translateY:0}, null, ANIMATION_LENGTH/4));
				else this.css({display:"inline-block"}, x => x.anime({opacity:1}, null, ANIMATION_LENGTH/4));
			}
		})
		.on("go",function(){
			if(this.dataset.pragmastate != "hidden"){
				this.data({pragmastate:"hidden"});
				// this.raise()
				let
				x = [0,"-100vw","100vw"][["left","right"].indexOf(this.dataset.hideposx)+1]
				, y = [0,"-100vh","100vh"][["top","bottom"].indexOf(this.dataset.hideposy)+1];
				if(x) this.anime({ translateX:x, opacity:0 }, z => { if(z.dataset.role=="dismiss") z.remove(); else z.css({display:"none"}); }, ANIMATION_LENGTH/2);
				else if(y) this.anime({ translateY:y, opacity:0 }, z => { if(z.dataset.role=="dismiss") z.remove(); else z.css({display:"none"}); }, ANIMATION_LENGTH/2);
				else this.desappear(ANIMATION_LENGTH/2,this.dataset.role=="dismiss"?true:false);
			}
		});
	});
	tileClickEffectSelector(".-tile");
	setTimeout(()=>{  $(".--boot-progress").anime({height:"4em", opacity:.1});  }, ANIMATION_LENGTH);
});

app.onPragmaChange.add(x => {
	$(".--screen").each(function(){
		if(this.has("--"+Object.keys(bootstrap.loaders)[x])) this.dispatchEvent(__come);
		else this.dispatchEvent(__go);
	});
});

__scroll = new Swipe(app.body);
__scroll.up(()=>{ });
__scroll.down(()=>{ });
__scroll.right(()=>{ });
__scroll.left(()=>{ });
__scroll.fire();