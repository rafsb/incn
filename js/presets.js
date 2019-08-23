const HOME = 0;

bootstrap.screens = { home: false };

bootstrap.loadComponents.add(function(){
    // load components
	bootstrap.ready("home");
});

bootstrap.onFinishLoading.add(function(){

});

app.onPragmaChange.add(function(x){

});

__scroll = new Swipe(app.body);
__scroll.up(()=>{ });
__scroll.down(()=>{ });
__scroll.right(()=>{ });
__scroll.left(()=>{ });
__scroll.fire();