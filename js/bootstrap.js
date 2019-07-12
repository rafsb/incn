bootstrap = {
	screens : {
		splash_screen   : null
		, splash_svg	: null
		, header 		: null
		, footer		: null
		, home			: null
		, rmenu 		: null
		, lmenu 		: null
		, whoweare 		: null
		, about 		: null
		, policy 		: null
		, finish		: null
		// , lock 			: null
	}
	, finishPool : new Pool()
	, changePool: new Pool()
	, pace : function(){
		let
		count = 0;
		for(var i in this.screens) count++;
		return 100/count;
	}
	, percent : function(){
		let
		count = 1;
		for(var i in this.screens) if(this.screens[i]) count++;
		return count * this.pace();
	}
	, status : function(scr){
		return this.screens[scr]
	}
	, ready : function(scr){
		// console.log(scr)
		if(this.lock) return;
		let
		__progress = this.percent();
		if(scr) this.screens[scr] = true
		if(Math.ceil(__progress)==100) {
			this.finishPool.fire();
			return true
		} else this.changePool.fire();

		return false
	}
};