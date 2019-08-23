
var
app = {
	debug: false
	, current: 0
	, last : 0
	, fw: faau
	, body: document.getElementsByTagName("body")[0]
	, onPragmaChange: new Pool()
	, get: function(e,w){ return faau.get(e,w||document).nodearray }
	, screens: function(){ return document.getElementsByClassName("--screen") }
    , declare: function(obj){
    	Object.keys(obj).each(function(){ window[this+""] = obj[this+""] })
    }
	, initialize: function(){
		
		this.device_id = window.location.href.split("#!")[1];

		/* SPLASH SCREEN LOAD */
		app.fw.load("views/splash.htm", null, $(".--screen.--splash")[0], function(){ bootstrap.ready("splash") });
		
		$(".--screen").each(function(){
			this.on("come",function(){ 
				if(this.dataset.hideposx) this.anime({translateX:0},ANIMATION_LENGTH/2);
				else if(this.dataset.hideposy) this.anime({translateY:0},ANIMATION_LENGTH/2);
			});
			this.on("go",function(){
				let
				x = [0,"-100vw","100vw"][["left","right"].indexOf(this.dataset.hideposx)+1]
				, y = [0,"-100vh","100vh"][["top","bottom"].indexOf(this.dataset.hideposy)+1];

				if(x) this.anime({ translateX:x }, ANIMATION_LENGTH, 0, function(){ if(this.dataset.role=="dismiss") this.remove() });
				else if(y) this.anime({ translateY:y }, ANIMATION_LENGTH, 0, function(){ if(this.dataset.role=="dismiss") this.remove() });
				else setTimeout(function(x){ x.desappear(ANIMATION_LENGTH,x.dataset.role=="dismiss"?true:false) },ANIMATION_LENGTH,this);
			});
			if(this.has("--splash")) this.do(__come);
			else this.do(__go);
		});
		
		bootstrap.loadComponents.fire()
	}
};
app.spy("pragma",function(x){
	app.last = app.current;
	app.current = x;
	if(!bootstrap.ready()) return setTimeout((x)=>{ app.pragma = x }, ANIMATION_LENGTH, x);
	$(".--screen").each(function(){ if(this.has("--"+Object.keys(bootstrap.screens)[x])) this.dispatchEvent(__come); else this.dispatchEvent(__go) });
	this.onPragmaChange.fire(x);
});