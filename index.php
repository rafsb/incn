<?php
header("Access-Control-Allow-Origin: *");
// header('Content-type: text/html; charset=utf-8');
header('Content-type: application/json; charset=utf-8');
session_start();

spl_autoload_register(function($class)
{
    $class = preg_replace("/\\\\/",'/',$class);
    $path  = __DIR__ . DIRECTORY_SEPARATOR . "webroot" . DIRECTORY_SEPARATOR . "classes" . DIRECTORY_SEPARATOR . ucfirst($class) . ".class.php";

    if(is_file($path)) include_once $path;
    else
    {
        $path = __DIR__ . DIRECTORY_SEPARATOR . "lib" . DIRECTORY_SEPARATOR . "php" . DIRECTORY_SEPARATOR . ucfirst($class) . ".class.php";
        if(is_file($path)) include_once $path;
        else Core::response(0, $class . ": not found...");
    }
    
    if(!is_file($path)){
        $class = explode("/",$class);
        $namespaces = array_slice($class, 0, sizeof($class)-1);
        foreach($namespaces as &$ns) $ns=strtolower($ns); 
        $tmp = array_merge(["src"],array_slice($class, sizeof($class)-1));
        $class = implode("/", array_merge($namespaces,$tmp));
        $path = __DIR__ . DIRECTORY_SEPARATOR . "modules" . DIRECTORY_SEPARATOR . $class . ".php";
        // echo $path . " || " . (is_file($path) ? "exists" : "not exists"); die;
        if(is_file($path)) include_once $path;
        else Core::response(0, $class . ": not found...");
    }
});

require "lib" . DIRECTORY_SEPARATOR . "php" . DIRECTORY_SEPARATOR . "Constants.php";
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