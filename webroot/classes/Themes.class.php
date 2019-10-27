<?php
class Themes extends Activity
{
    private static $themes = [
        "light" => [
            "BACKGROUND"    => "#FFFFFF"
            , "FOREGROUND"  => "#ECF1F2"
            , "FONT"        => "#2C3D4F"
            , "FONTBLURED"  => "#7E8C8D"
            , "SPAN"        => "#2980B9"
            , "DISABLED" =>  "#BDC3C8"
            , "DARK1"    => "rgba(0,0,0,.16)"
            , "DARK2"    => "rgba(0,0,0,.32)"
            , "DARK3"    => "rgba(0,0,0,.64)"
            , "LIGHT1"   => "rgba(255,255,255,.16)"
            , "LIGHT2"   => "rgba(255,255,255,.32)"
            , "LIGHT3"   => "rgba(255,255,255,.64)"
        ]
        , "dark" => [
            "BACKGROUND"    => "#000000"
            , "FOREGROUND"  => "#252526"
            , "FONT"        => "#ECF1F2"
            , "FONTBLURED"  => "#BDC3C8"
            , "SPAN"        => "#3398DB"
            , "DISABLED" =>  "#95A5A6"
            , "DARK1"    => "rgba(0,0,0,.08)"
            , "DARK2"    => "rgba(0,0,0,.16)"
            , "DARK3"    => "rgba(0,0,0,.32)"
            , "LIGHT1"   => "rgba(255,255,255,.08)"
            , "LIGHT2"   => "rgba(255,255,255,.16)"
            , "LIGHT3"   => "rgba(255,255,255,.32)"
        ]
    ];

    public static function default(){
        return Convert::json(self::$themes["light"]);
    }

    public static function light(){
        return Convert::json(self::$themes["light"]);
    }

    public static function dark(){
        return Convert::json(self::$themes["dark"]);
    }
}