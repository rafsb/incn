const 
START = 0
, HOME = 1
, FEED = 2
, SOCIAL = 3
, SEEK = 4
, NOTIFICATION = 5
, MENU = 6
;

var
__come = new Event('come')
, __go = new Event('go');

app.hash = app.storage("hash");
app.theme = app.storage("theme");
app.body = $("body")[0];
app.initial_pragma = HOME;

if(!app.theme){
	app.call("https://")
}

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
	// tiles
	, main_tile: 0
	, row_tile: 0
	, tag: 0
	// stuff
	, footer_icons: 0
};

app.components = {};

bootstrap.loadComponents.add(function(){
    // screens
    app.exec("js/screens/splash.js")
    app.exec("js/screens/home.js")
    app.exec("js/screens/feed.js")
    app.exec("js/screens/social.js")
    app.exec("js/screens/seek.js")
    app.exec("js/screens/notification.js")
    app.exec("js/screens/menu.js")

    //components
    app.exec("js/components/footer.js")
	app.exec("js/tiles/main.js")
	app.exec("js/tiles/row.js")
	app.exec("js/tiles/tag.js")
});

bootstrap.onFinishLoading.add(function(){
	$(".--screen").each(scr => {
		scr
		.on("come",function(){
			if(this.dataset.pragmastate != "shown"){
				this.data({pragmastate:"shown"});
				// this.raise()
				if(this.dataset.hideposx) this.css({display:"inline-block"}, x => x.stop().anime({opacity:1, translateX:0}, null, ANIMATION_LENGTH/2));
				else if(this.dataset.hideposy) this.css({display:"inline-block"}, x => x.stop().anime({opacity:1, translateY:0}, null, ANIMATION_LENGTH/2));
				else this.css({display:"inline-block"}, x => x.stop().anime({opacity:1}, null, ANIMATION_LENGTH/2));
			}
		})
		.on("go",function(){
			if(this.dataset.pragmastate != "hidden"){
				this.data({pragmastate:"hidden"});
				// this.raise()
				let
				x = [0,"-20vw","20vw"][["left","right"].indexOf(this.dataset.hideposx)+1]
				, y = [0,"-20vh","20vh"][["top","bottom"].indexOf(this.dataset.hideposy)+1];
				if(x) this.stop().anime({ translateX:x, opacity:0 }, z => { if(z.dataset.role=="dismiss") z.remove(); else z.css({display:"none"}); }, ANIMATION_LENGTH/4);
				else if(y) this.stop().anime({ translateY:y, opacity:0 }, z => { if(z.dataset.role=="dismiss") z.remove(); else z.css({display:"none"}); }, ANIMATION_LENGTH/4);
				else this.stop().desappear(ANIMATION_LENGTH/4,this.dataset.role=="dismiss"?true:false);
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
	$(".--footer-icon-tile").each((z,i) => z.anime({background: (x==HOME || i+2!=x ? app.colors().CLOUDS : app.colors().WET_ASPHALT) }));
});

__scroll = new Swipe(app.body);

// __scroll.up(()=>{
	
// });

// __scroll.down(()=>{
	
// });

__scroll.right(()=>{
	if(app.current > HOME) app.pragma = app.current-1;
	else app.pragma = MENU
});

__scroll.left(()=>{
	if(app.current < MENU) app.pragma = app.current+1;
	else app.pragma = HOME
});

__scroll.fire();

