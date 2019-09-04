<?php
header("Access-Control-Allow-Origin: *");
// header('Content-type: text/html; charset=utf-8');
header('Content-type: application/json; charset=utf-8');

session_start();

require "lib" . DIRECTORY_SEPARATOR . "php" . DIRECTORY_SEPARATOR . "autoload.php";

//spl_autoload_register($autoLoadFunction);

require "lib" . DIRECTORY_SEPARATOR . "php" . DIRECTORY_SEPARATOR . "constants.php";

require "webroot" . DS . "App.php";

if(!User::logged()) if(Request::cook("USER") && Request::cook("ACTIVE")) Request::sess("USER",Request::cook("USER"));

// echo "<pre>";print_r($_SERVER);die;

if(Request::get('_'))
{   
    // echo "<pre>";print_r(Request::get('uri'));die;
    $args = explode('/',Request::get('_'));
    $uri = 'echo (new ' . ucfirst($args[1]) . ")->" . (isset($args[2]) && $args[2] ? $args[2] : "render") . "('" . implode("','",array_slice($args,3)) . "');";

    try{ eval($uri); } catch(Exception $e){ IO::debug($e); Debug::show(); }
}
else
{
    \App::init();
}
flush();
ob_flush();