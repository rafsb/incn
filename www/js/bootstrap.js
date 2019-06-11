window.
bootstrap = {
	screens : {
		// secreens
		splash    	 : false
		, home    	 : false
	}
	, pace : function(){
		let
		count = 0;
		for(var i in this.screens) count++;
		return 100/count;
	}
	, percent: function(){
		let
		count = 0;
		for(var i in this.screens) if(this.screens[i]) count++;
		return count*this.pace();
	}
	, status: function(scr){
		return this.screens[scr]
	}
	, ready: function(scr){
		if(scr) this.screens[scr] = true;
		return this.percent()>99?true:false
	}
};