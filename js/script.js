const 
SPLASH = 0
, HOME = 1;

var
__come = new Event('come')
, __go = new Event('go');

app.hash = app.storage("hash") || "@";
app.body = $("body")[0];

bootstrap.loaders = { 
	// screens
	splash: 0
	, home: 1
	// components
	, footer: 0
	, tile:0
	// stuff
	, footer_icons:0
};

app.components = {};

bootstrap.loadComponents.add(function(){
    app.load("views/splash.htm", null, $(".--screen.--splash")[0]);
    app.load("views/components/footer.htm", null, $("body>footer")[0]);
    app.call("views/tiles/main.htm").then(t => { app.components.tile = t.data.prepare(app.colors()).morph()[0]; bootstrap.ready("tile"); });
});

bootstrap.onFinishLoading.add(function(){
	$(".--screen").each(scr => {
		scr
		.on("come",function(){ 
			if(this.dataset.hideposx) this.anime({translateX:0},ANIMATION_LENGTH/2);
			else if(this.dataset.hideposy) this.anime({translateY:0},ANIMATION_LENGTH/2);
		})
		.on("go",function(){
			let
			x = [0,"-100vw","100vw"][["left","right"].indexOf(this.dataset.hideposx)+1]
			, y = [0,"-100vh","100vh"][["top","bottom"].indexOf(this.dataset.hideposy)+1];

			if(x) this.anime({ translateX:x }, ANIMATION_LENGTH, 0, me => { if(me.dataset.role=="dismiss") me.remove() });
			else if(y) this.anime({ translateY:y }, ANIMATION_LENGTH, 0, me => { if(me.dataset.role=="dismiss") me.remove() });
			else setTimeout(function(x){ x.desappear(ANIMATION_LENGTH,x.dataset.role=="dismiss"?true:false) },ANIMATION_LENGTH,this);
		});
	});
	setTimeout(()=>{ $(".--boot-progress")[0].anime({height:"4em", opacity:.1}, ANIMATION_LENGTH); },ANIMATION_LENGTH/2);
	app.pragma = HOME;
});

app.onPragmaChange.add(x => {
	$(".--screen").each(function(){ if(this.has("--"+Object.keys(bootstrap.loaders)[x])) this.dispatchEvent(__come); else this.dispatchEvent(__go) });
});

__scroll = new Swipe(app.body);
__scroll.up(()=>{ });
__scroll.down(()=>{ });
__scroll.right(()=>{ });
__scroll.left(()=>{ });
__scroll.fire();