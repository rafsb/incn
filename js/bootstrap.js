window.
bootstrap = {
	screens : [ 
	
		"splash"
		, "home" 
	
	]
	, screen_statuses : {}
	, pace : function(){ return 100/this.screens.length }
	, percent: function(){
		let
		count = 0;
		for(var i in this.screens) if(this.screen_statuses[this.screens[i]]) count++;
		return count*this.pace();
	}
	, status: function(scr){
		return this.screen_statuses[scr]
	}
	, ready: function(scr){
		if(scr){
			// set screen to true
			this.screen_statuses[scr] = true;
			return this.ready()
		}
		let
		perc = this.percent();
		// update progress bar
		$(".--screen.--splash .--progress").anime({width:perc+"%"}, ANIMATION_LENGTH);
		// init only on 100%
		if(perc>=99) setTimeout(__renderize,ANIMATION_LENGTH)

		return this.percent()>99?true:false
	}
};