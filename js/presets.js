const 
HOME 		  = 0
, RMENU 	  = 1
, LMENU 	  = 2
, WHOWEARE 	  = 4
, ABOUT 	  = 5
, POLICY 	  = 6;

var
__come = new Event('come')
, __go = new Event('go')
, __scroll = null
, __init_components = function(){

    // load components
	app.fw.load("views/components/header.htm", null, $("header")[0], ()=>{ bootstrap.ready("header") });
	app.fw.load("views/components/footer.htm", null, $("footer")[0], ()=>{ bootstrap.ready("footer") });

	// load screens
	app.fw.load("views/home.htm" 	 , null, $(".--screen.--home")[0]	 , ()=>{ bootstrap.ready("home")  	 });
	app.fw.load("views/rmenu.htm"   , null, $(".--screen.--rmenu")[0]	 , ()=>{ bootstrap.ready("rmenu")  	 });
	app.fw.load("views/lmenu.htm"   , null, $(".--screen.--lmenu")[0]	 , ()=>{ bootstrap.ready("lmenu") 	 });
	app.fw.load("views/whoweare.htm", null, $(".--screen.--whoweare")[0], ()=>{ bootstrap.ready("whoweare") });
    app.fw.load("views/about.htm"   , null, $(".--screen.--about")[0]	 , ()=>{ bootstrap.ready("about") 	 });
	app.fw.load("views/policy.htm"  , null, $(".--screen.--policy")[0]	 , ()=>{ bootstrap.ready("policy") 	 });

	// app.fw.call("http://" + SERVER_URI + "/properties/retrieve", function(){
	// 	if(this.status!=200){
	// 		app.fw.error("erro ao carregar os imóveis...")
	// 		return
	// 	}
	// 	console.log(this.data.json()[0])
    // })
    
    __scroll = new Swipe(app.body,64);

    // controlling scroll usage
    __scroll.up(()=>{})
    __scroll.down(()=>{})
    __scroll.right(()=>{})
    __scroll.left(()=>{})

	setTimeout(()=>{ bootstrap.ready("finish") }, 800)
};