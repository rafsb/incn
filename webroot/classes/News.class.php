<?php
class News extends Activity
{

	public static function parse()
	{
		$groups = IO::scan("var/rss", false, false);
		if(empty($groups)) return Core::response(-1, "no group found");
		foreach($groups as $group)
		{
			$feeds = IO::scan("var/rss/tmp/".$group, false, false);
			if(empty($feeds)) return Core::response(-2, "no feeds found");
			foreach($feeds as $feed)			
			{
				$feed = Convert::xml2json(IO::read("var/rss/tmp/$group/$feed"))->channel;
				Async::each($feed->item, function($item){
					print_r($item) . "\n\n";
				});
			}
		}
	}


}