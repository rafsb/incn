
const
SPLASH_SCREEN_CLASS_SELECTOR = ".--splash";

var
app = {
	debug: false
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
		/* SPLASH SCREEN */
		app.fw.load("views/splash.html", null, $(SPLASH_SCREEN_CLASS_SELECTOR)[0]);
	}
};

app.spy("pragma",function(x){
	app.last = app.current;
	app.current = x;
});