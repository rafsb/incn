
const
SERVER_URI = "shimada-api.faau.me"
, SPLASH_SCREEN_CLASS_SELECTOR = ".--splash";

var
firebaseConfig = {
	apiKey: "AIzaSyDGCBaCOuAuyp0QH5aC8fIK0gz5htVj-6M",
	authDomain: "rafsb-apps.firebaseapp.com",
	databaseURL: "https://rafsb-apps.firebaseio.com",
	projectId: "rafsb-apps",
	storageBucket: "rafsb-apps.appspot.com",
	messagingSenderId: "279336801488",
	appId: "1:279336801488:web:e2cf1dd155bcb42d"
}
, app = {
	debug: false
	, screens : []
	, current: 0
	, last : 0
	, fw: faau
	, body: null
	, get: function(e,w){ return faau.get(e,w||document).nodearray }
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
		this.body = document.getElementsByTagName("body")[0];
		
		$(".--screen").each(function(){
			
			this.on("come",function(){ 
				// console.log("come",this.className); 
				this.anime({ translateY:0, translateX:0},ANIMATION_LENGTH/2) 
			});
			
			this.on("go",function(){
				let
				x = ["0","-100vw","100vw"][["left","right"].indexOf(this.dataset.hideposx)+1]
				, y = ["0","-100vh","100vh"][["top","bottom"].indexOf(this.dataset.hideposy)+1]
				, z = this.dataset.hideposz;

				// console.log("go",this.className,x,y,z);

				this.anime({ translateY:y||"0", translateX:x||"0" }, ANIMATION_LENGTH, 0, function(){ if(this.dataset.role!=="keep") this.remove() });
			});

			if(this.has("--splash")) this.do(__come);
			else this.do(__go);
		});

		/* SPLASH SCREEN */
		app.fw.load("views/splash.htm", null, $(SPLASH_SCREEN_CLASS_SELECTOR)[0], ()=>{ bootstrap.ready("splash_screen") });
	}
};

app.spy("pragma",function(x){

	app.last = app.current;
	app.current = x;

	let
	cls = ["home","rmenu","lmenu","whoweare","about","policy"][x];
	$(".--screen").each(function(){ this.do(this.has("--"+cls) ? __come : __go) });
	
	switch(x){
		
		case HOME:
			$("header")[0].anime({translateY:0})
			$("footer")[0].anime({translateY:0})
		break;
		
		case RMENU:
		break;
		
		case LMENU:
		break;

		case LOGIN:
		break;

		case WHOWEARE:
		break;

		case ABOUT:
		break;

		case POLICY:
        break;
        
	}
});