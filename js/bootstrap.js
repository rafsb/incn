bootstrap = {
	screens : {
		continuing: false 
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
		if(scr){
			// set screen to true
			this.screens[scr] = true;

			let
			perc = this.percent();
			// update progress bar
			$(".--progress").anime({width:perc+"%"}, ANIMATION_LENGTH);
			// init only on 100%
			if(perc>=99) this.onFinishLoading.fire();
		}
		return this.percent()>99?true:false
	}
	, loadComponents : new Pool()
	, onFinishLoading : new Pool()
};