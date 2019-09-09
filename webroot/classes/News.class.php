<?php
class News extends Activity
{

	public static function parse($days=7)
	{
		$all = $partial = 1;
		$groups = IO::scan("var/rss", false, false);
		if(empty($groups)) return Core::response(-1, "no group found");
		
		$all *= sizeof($groups);

		foreach($groups as $group)
		{
			$feeds = IO::scan("var/rss/tmp/" . $group, false, false);
			$parseds = IO::mkf("var/rss/parsed/" . $group) ? "var/rss/parsed/" . $group : null;

			if(!$parseds||empty($feeds)) return Core::response(-2, "no feeds found");

			$all *= sizeof($feeds);

			foreach($feeds as $feed)			
			{
				$feed = Convert::xml2json(IO::read("var/rss/tmp/$group/$feed"))->channel;

				$all *= sizeof($feed->item);

				Async::each($feed->item, function($item) use ($parseds, $days){
					// print_r($item); die;
					$time    = strtotime($item->value->pubDate);
					$barrier = (time() - (($days ? $days : 7) * 24 * 60 * 60));
					$hash    = Hash::word(Convert::json($item->value),MD5);
					if($time > $barrier) if(!is_file(IO::root($parseds . "/" . $time . "-" . $hash))) IO::jin($parseds . "/" .$time . "-" . $hash, $item->value);
					IO::write("var/$time",$time);
				});
			}

		}

	}

	public static function cleanup($days=30){
		$groups = IO::scan("var/rss", false, false);
		if(empty($groups)) return Core::response(-1, "no group found");
		foreach($groups as $group)
		{
			$parseds = IO::mkf("var/rss/parsed/" . $group) ? "var/rss/parsed/" . $group : null;
			if(!$parseds) return Core::response(-2, "no feeds found");

			$feeds = IO::scan($parseds, false, false);
			if(!empty($feeds)) Async::each($feeds, function($item) use ($parseds, $days){
				$time = strtotime(explode("-",$item)[0]);
				if($time < (time() - ($days * 24 * 60 * 60))) IO::rm($parseds . DS . $item);
			});
		}

	}

}