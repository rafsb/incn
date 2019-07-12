bootstrap = {
	screens : {
		splash    	 : null
		, login 	 : null
	}
	, pace : function(){
		let
		count = 0;
		for(var i in this.screens) count++;
		return 100/count;
	}
	, percent: function(){
		let
		count = 1;
		for(var i in this.screens) if(this.screens[i]) count++;
		return count*this.pace();
	}
	, status: function(scr){
		return this.screens[scr]
	}
	, ready: function(scr){
		let
		__progress = this.percent();
		if(scr) this.screens[scr] = true
		$(".--progress").anime({width:__progress+"%"})
		if(__progress>99){
			$(".--screen.--splash").desappear(ANIMATION_LENGTH, REMOVE);
			return true
		}
		return false
	}
};