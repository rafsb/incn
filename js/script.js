const 
START 	  	= 0
;
bootstrap.loaders = {
	// secreens
	start    	 : false
};
bootstrap.loadComponents.add(()=>{});
bootstrap.onFinishLoading.add(()=>{});

app.onPragmaChange.add(function(x){
	console.log(x);
	switch(x){
		case START: /**********/ break;
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