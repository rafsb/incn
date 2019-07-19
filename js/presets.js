const 
HOME = 0;

Element.prototype.do = function(ev){ this.dispatchEvent(ev) };

var
__come = new Event('come')
, __go = new Event('go')
, __scroll = new Swipe(app.body)
, __pragma_fn = function(x){
	switch(x){
		case HOME	: 	break;
		default		: 	break;
	}
}
, __renderize = function(){
	app.pragma = HOME
};

// controlling scroll usage
__scroll.up(()=>{ /* TODO: scroll behavior */ });
__scroll.down(()=>{  /* TODO: scroll behavior */ });
__scroll.left(()=>{  /* TODO: scroll behavior */ });
__scroll.right(()=>{  /* TODO: scroll behavior */ });

app.spy("pragma",function(x){

	app.last = app.current;
	app.current = x;

	let
	cls = bootstrap.screens[x];

	$(".--screen").each(function(){ if(this.has("--"+cls)) this.do(__come); else this.do(__go) });
		
	setTimeout(__pragma_fn,ANIMATION_LENGTH/8,x)

});