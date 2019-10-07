<?php
if(!defined("DEBUG")) define("DEBUG", true);
if(!defined("LOGIN_REQUIRED")) define("LOGIN_REQUIRED",  true);

class App extends Core
{
	private static $config = [
    	"developer"                 => "DEV Team"
        , "project_name"            => "MobileApi"
        , "driver"                  => DISK
        , "get_config_min_level"    => MANAGER
        , "hash_algorithm"          => SHA512
        , "database_credentials"    => [
			"host" 		 => "127.0.0.1"
            , "username" => "root"
        	, "passwd"   => ""
	        , "database" => "test"
        	, "encoding" => "utf8"
		]
	];

	private static $datasources = [

    	"default"  => []

	];

	public static function init() {
		if(!LOGIN_REQUIRED||User::logged()) (new Home)->render();
		else (new Login)->render();
	}
}

 