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

app.pragma_colors = [
	app.colors().CLR_CLOUDS
	, app.colors().CLR_CLOUDS
	, app.colors().CLR_MIDNIGHT_BLUE
	, app.colors().CLR_POMEGRANATE 
	, app.colors().CLR_WISTERIA
	, app.colors().CLR_PUMPKIN
	, app.colors().CLR_GREEN_SEA
];

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
				if(this.dataset.hideposx) this.css({display:"inline-block"}, x => x.anime({opacity:1, translateX:0}, null, ANIMATION_LENGTH/2));
				else if(this.dataset.hideposy) this.css({display:"inline-block"}, x => x.anime({opacity:1, translateY:0}, null, ANIMATION_LENGTH/2));
				else this.css({display:"inline-block"}, x => x.anime({opacity:1}, null, ANIMATION_LENGTH/2));
			}
		})
		.on("go",function(){
			if(this.dataset.pragmastate != "hidden"){
				this.data({pragmastate:"hidden"});
				// this.raise()
				let
				x = [0,"-20vw","20vw"][["left","right"].indexOf(this.dataset.hideposx)+1]
				, y = [0,"-20vh","20vh"][["top","bottom"].indexOf(this.dataset.hideposy)+1];
				if(x) this.anime({ translateX:x, opacity:0 }, z => { if(z.dataset.role=="dismiss") z.remove(); else z.css({display:"none"}); }, ANIMATION_LENGTH/4);
				else if(y) this.anime({ translateY:y, opacity:0 }, z => { if(z.dataset.role=="dismiss") z.remove(); else z.css({display:"none"}); }, ANIMATION_LENGTH/4);
				else this.desappear(ANIMATION_LENGTH/4,this.dataset.role=="dismiss"?true:false);
			}
		})
	});
	tileClickEffectSelector(".-tile");
	$(".--screen-nav-back").css({rotate:"-90deg"}).on("click",()=>app.pragma=HOME);
	setTimeout(()=>{  $(".--boot-progress").anime({height:"4em", opacity:0});  }, ANIMATION_LENGTH)
});

app.onPragmaChange.add(x => {
	$(".--screen").each(function(){
		if(this.has("--"+Object.keys(bootstrap.loaders)[x])) this.dispatchEvent(__come);
		else this.dispatchEvent(__go)
	});
	$(".--footer-icon-tile svg").each((z,i) => z.anime({filter: "invert("+(x==HOME || i+2!=x ? 0 : 1)+")" }));
	$(".--footer-icon-tile").each((z,i) => z.anime({background: (x==HOME || i+2!=x ? app.colors().CLR_CLOUDS : app.pragma_colors[x]) }))
});

__scroll = new Swipe(app.body);

__scroll.up(()=>{
	if(app.last != HOME) app.pragma = app.last
});

__scroll.down(()=>{
	if(app.current != HOME) app.pragma = HOME
});

__scroll.right(()=>{
	if(app.current > HOME) app.pragma = app.current-1;
	else app.pragma = MENU
});

__scroll.left(()=>{
	if(app.current < MENU) app.pragma = app.current+1;
	else app.pragma = HOME
});

__scroll.fire();