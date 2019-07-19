var
app = {
	debug: false
	, current: 0
	, last : 0
	, fw: faau
	, body: document.getElementsByTagName("body")[0]
	, get: function(e,w){ return faau.get(e,w||document).nodearray }
	, screens: function(){ return document.getElementsByClassName("--screen") }
    , onDeviceReady: function(){ this.receivedEvent('deviceready') }
    , receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
        // console.log('Received Event: ' + id);
    }
	, initialize: function(){
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		document.addEventListener("backbutton", ()=>{ faau.error(app.last) }, false);

		/* SPLASH SCREEN LOAD */
		app.fw.call("views/splash.htm", null, function(){ $(".--screen.--splash")[0].app(this.data.morph()).evalute() })

		$(".--screen").each(function(){
			
			this.on("come",function(){ if(this.dataset.hideposx) this.anime({translateX:0},ANIMATION_LENGTH/2); else if(this.dataset.hideposy) this.anime({translateY:0},ANIMATION_LENGTH/2) });
			
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
		
	}
};