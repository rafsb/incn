<?php
class News extends Activity
{

	public static function parse($days=null)
	{
		$days = $days ? $days : 7;
		$all = $partial = 1;
		$groups = IO::scan("var/rss", false, false);
		if(empty($groups)) return Core::response(-1, "no group found");
		
		$all *= sizeof($groups);

		foreach($groups as $group)
		{
			$feeds = IO::scan("var/rss/tmp/" . $group, false, false);
			$parseds = IO::mkd("var/rss/parsed/" . $group) ? "var/rss/parsed/" . $group : null;

			if(!$parseds||empty($feeds)) return Core::response(-2, "no feeds found");

			$all *= sizeof($feeds);

			foreach($feeds as $feed)			
			{
				$feed_path = "var/rss/tmp/$group/$feed";
				if(!is_file(IO::root($feed_path))) return Core::response(-3, "feed file not found");
				$feed = Convert::xml2json(IO::read($feed_path));
				if($feed=="")
				{
					if(!is_dir(IO::root($feed_path))){
						IO::rm($feed_path);
						return Core::response(-4, "rss empty, removing for avoid future errors");
					}
				}
				else $feed = $feed->channel;

				$all *= sizeof($feed->item);

				Async::each($feed->item, function($item) use ($parseds, $days){
					// print_r($item); die;
					$time    = strtotime($item->pubDate);
					$barrier = (time() - (($days ? $days : 7) * 24 * 60 * 60));
					$hash    = Hash::word(Convert::json($item),MD5);
					if($time > $barrier) if(!is_file(IO::root($parseds . "/" . $time . "-" . $hash))) IO::jin($parseds . "/" .$time . "-" . $hash, $item);
					// IO::write("var/tmp/$time", $time, APPEND);
				});				
			}

		}
		return Core::response(1, "nicely done");

	}

	public static function cleanup($days=null){
		$days = $days ? $days : 30;
		$groups = IO::scan("var/rss", false, false);
		if(empty($groups)) return Core::response(-1, "no group found");
		foreach($groups as $group)
		{
			$parseds = IO::mkd("var/rss/parsed/" . $group) ? "var/rss/parsed/" . $group : null;
			if(!$parseds) return Core::response(-2, "no feeds found");

			$feeds = IO::scan($parseds, false, false);
			if(!empty($feeds)) Async::each($feeds, function($item) use ($parseds, $days){
				$time = time() - explode("-",$item->value)[0]*1;
				if($time > (time() - ($days * 24 * 60 * 60))) IO::rm($parseds . DS . $item->value);
			});
		}

		return Core::response(1, "flawesly victory");

	}

}