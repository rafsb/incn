const 
START 	  	= 0
, MENU 		= 1
, LOGIN 	= 2
, USER 		= 3
, PUSH 		= 4
;
bootstrap.loaders = {
	// secreens
	start    	 : false
	, menu    	 : false
	, login   	 : false
	// componentes
	, header  	 : false
	// jsons
	, request 	 : false
	// scripts
	, init_script: false
};
bootstrap.loadComponents.add(()=>{});
bootstrap.onFinishLoading.add(()=>{});

app.spheres = {};
app.components = {};
app.notifications = null;
app.fw.color_pallete.current = {};
app.onPragmaChange.add(function(x){
	console.log(x);
	switch(x){
		case START: /**********/ break;
		case MENU:  /**********/ break;
		case LOGIN: /**********/ break;
		case USER : 
			app.fw.load("user/dash",null,$(".--stage")[0]);
		break;
		case PUSH : 
			app.fw.load("push/dash",null,$(".--stage")[0]);
		break;
    }
});
// controlling scroll usage
var
__swipe = new Swipe(document.getElementsByTagName("body")[0]);
   __swipe.up(()=>{ /**********/ });
 __swipe.down(()=>{ /**********/ });
 __swipe.left(()=>{ /**********/ });
__swipe.right(()=>{ /**********/ });
__swipe.fire();