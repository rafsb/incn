Element.prototype.do = function(ev){ this.dispatchEvent(ev) };


var
__come = new Event('come')
, __go = new Event('go')
, __scroll = new Swipe(app.body);

const 
START 	  	  = 0
, CLIPPINGHOME= 1
, FEEDSHOME	  = 2
, MENU 		  = 3
, LOGIN 	  = 4
, WHOWEARE 	  = 5
, ABOUT 	  = 6
// , CHARTCHANGE = 7
// , NOCHART 	 = 8
, POLICY 	 = 9
;

app.spheres = {};
app.components = {};

bootstrap.screens = {
	// secreens
	splash    	   	: false
	, clippinghome 	: false
	, feedshome    	: false
	, right_menu    : false
	, login   	  	: false
	, whoweare 	  	: false
	, about   	  	: false
	// , chartchange : false
	// , nochart 	  : false
	, policy 	  	: false
	// componentes
	, header  	   	: false
	, feeds_tile 	: false
	, clipping_tile : false
	, children_tile : false
	, clipping_tile_status : false
	, moods_tile 	: false
	, grandchildren_tile : false
	// jsons
	, mrc     	   	: false
	, feed  		: false
	// scripts
	, init_script 	: false
};

bootstrap.loadComponents.add(function(){
	// load components
	app.fw.call("views/components/header.htm", null, function(){ app.components.header = this.data; bootstrap.ready("header")  });

	// load tiles
	app.fw.call("views/tiles/feeds.htm", null, function(){ app.components.feed_tile = this.data; bootstrap.ready("feeds_tile") });
	app.fw.call("views/tiles/clipping.htm", null, function(){ app.components.clipping_tile = this.data; bootstrap.ready("clipping_tile") });
	app.fw.call("views/tiles/children.htm", null, function(){ app.components.children_tile = this.data; bootstrap.ready("children_tile") });
	app.fw.call("views/tiles/grandchildren.htm", null, function(){ app.components.grandchildren_tile = this.data; bootstrap.ready("grandchildren_tile") });
	app.fw.call("views/tiles/moods.htm", null, function(){ app.components.moods_tile = this.data; bootstrap.ready("moods_tile") });
	app.fw.call("views/tiles/clipping-status.htm", null, function(){ app.components.clipping_tile_status = this.data; bootstrap.ready("clipping_tile_status") });

	// load screens
	app.fw.call("views/clippinghome.htm", null, function(){ app.components.clippings = this.data; bootstrap.ready("clippinghome") });
	app.fw.call("views/feedshome.htm"   , null, function(){ app.components.feeds = this.data; bootstrap.ready("feedshome") 	});
	app.fw.load("views/right_menu.htm"  , null, $(".--screen.--right-menu")[0]	, ()=>{ bootstrap.ready("right_menu") 		});
	app.fw.load("views/whoweare.htm"    , null, $(".--screen.--whoweare")[0]	, ()=>{ bootstrap.ready("whoweare") 		});
	app.fw.load("views/about.htm"       , null, $(".--screen.--about")[0]	 	 , ()=>{ bootstrap.ready("about") 		});
	app.fw.load("views/login.htm"       , null, $(".--screen.--login")[0]	 	 , ()=>{ bootstrap.ready("login") 		});
	// app.fw.load("views/nochart.htm"     , null, $(".--screen.--nochart")[0]	 , ()=>{ bootstrap.ready("nochart") 	 	});
	app.fw.load("views/policy.htm"      , null, $(".--screen.--policy")[0]	 	, ()=>{ bootstrap.ready("policy") 		 	});

	// app.fw.call("src/json/mrc.json",null,function(){ app.mrc = this.data.json()[0]; bootstrap.ready('mrc') });
	app.fw.call("src/json/feed.json",null,function(){ app.feed = this.data.json(); bootstrap.ready('feed') });

	app.fw.call("http://api.spumedata.com/charts/retrieve",{ hash: btoa({hash:app.hash||app.fw.storage("hash"), cuid:app.fw.storage("current")}.stringify()) }, function(){
		if(this.status!=200||this.data.trim()=="[]") return app.fw.error("não foi possível carregar este gráfico...");
		app.spheres.content = this.data.json()[0];
		bootstrap.ready("mrc");
	})

	bootstrap.ready("init_script");
})

bootstrap.onFinishLoading.add(function(){ app.pragma = START })

app.onPragmaChange.add(function(x){
	switch(x){
		case START:
		 	$("body>header")[0].anime({translateY:0},ANIMATION_LENGTH/4,ANIMATION_LENGTH/4,function(){ this.get(".--backbutton").anime({opacity:0},ANIMATION_LENGTH/4) });
		 	$(".--clippinghome")[0].anime({translateX:0, height:"50vh"},ANIMATION_LENGTH/2).scroll({top:0,behavior:"smooth"});
		 	// $(".--clipping-status-tile")[0].anime({display:'none'},ANIMATION_LENGTH/2);
		 	$(".--feedshome")[0].anime({translateX:0, top:"50vh", height:"50vh"},ANIMATION_LENGTH/2).scroll({top:0,behavior:"smooth"});
		 	$(".--overlay").appear(ANIMATION_LENGTH*2);
		 	$(".--clippingtile, .--feedstile").anime({maxHeight:"4em", opacity:1});
		 	$(".--feedsclosetabs, .--clippingclosetabs").anime({opacity:0});
		 	// $(".--screen.--right-menu").anime({translateX:"100vw"});
		break;
		
		case CLIPPINGHOME:
			$(".--backbutton").anime({opacity:1},ANIMATION_LENGTH);
			$("header .--tab").at(0).addClass("--active");
		 	$(".--clippinghome").anime({height:"100%",translateX:0},ANIMATION_LENGTH/4).at().get(" .--overlay")[0].desappear(40);
		 	$(".--feedshome").anime({translateY:"100vh"}, ANIMATION_LENGTH/2);
		 	// $(".--clipping-status-tile")[0].anime({display:'block'},ANIMATION_LENGTH/2);
		 	// $(".--screen.--right-menu").anime({translateX:"100vw"});
		break;

		case FEEDSHOME:
			$(".--backbutton").anime({opacity:1},ANIMATION_LENGTH);
			$("header .--tab").at(1).addClass("--active");
			$(".--feedshome").anime({height:"100%",translateX:0, top:0},ANIMATION_LENGTH/4).at().get(" .--overlay")[0].desappear(40);
			$(".--clippinghome").anime({translateX:"-100vw",height:"100%",top:0},ANIMATION_LENGTH/2);
			// $(".--screen.--right-menu").anime({translateX:"100vw"});
		break;
		
		case MENU:
			$(".--backbutton").anime({opacity:1},ANIMATION_LENGTH);
			$("header .--tab").at(2).addClass("--active");
			// $(".--screen.--right-menu").anime({translateX:0});
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
})

// controlling scroll usage
__scroll.up(()=>{ 
	if(app.current==START) app.pragma = FEEDSHOME;
});
__scroll.down(()=>{
	if(app.current==START||(app.current==FEEDSHOME&&$(".--feedshome .--stage")[0].scrollTop==0)) app.pragma = CLIPPINGHOME;
});
__scroll.right(()=>{
	if(app.current==FEEDSHOME) app.pragma = CLIPPINGHOME;
});
__scroll.left(()=>{
	if(app.current==CLIPPINGHOME) app.pragma = FEEDSHOME;
});
__scroll.fire();