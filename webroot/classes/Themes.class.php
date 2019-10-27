<?php
class Themes extends Activity
{
    public static function default(){
        return IO::read("etc/themes.d/default.json");
    }

    public static function light(){
        return IO::read("etc/themes.d/light.json");
    }

    public static function dark(){
        return IO::read("etc/themes.d/dark.json");
    }
}