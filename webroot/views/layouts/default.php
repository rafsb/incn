<?php
if($this->allow_access()) header('Access-Control-Allow-Origin: ' . $this->allow_access()); // OLY FOR PUBLIC API USE
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: text/html; charset=UTF-8',true);?>
<!DOCTYPE html>
<html lang='pt-BR'>
    <head>
        <!-- Basic Tags -->
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-eval' data: blob: filesystem: ws: gap: cdvfile: https://ssl.gstatic.com *; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: 'unsafe-inline'; connect-src * 'unsafe-inline'; child-src *; media-src *;" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, minimal-ui, viewport-fit=cover" />
        
        <!-- Android Tags -->
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="theme-color" content="#343A40"/>
        <link rel="manifest" href="manifest.json"/>

        <!-- Apple Tags -->
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="<?=App::project_name()?>"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="format-detection" content="telephone=no"/>
        <link rel="apple-touch-icon" sizes="180x180" href="src/img/icons/favicon/apple-touch-icon-180x180.png"/> <!-- iPhone -->
        <link rel="apple-touch-icon" sizes="167x167" href="src/img/icons/favicon/apple-touch-icon-167x167.png"/> <!-- iPad Pro -->
        <link rel="apple-touch-icon" sizes="152x152" href="src/img/icons/favicon/apple-touch-icon-152x152.png"/> <!-- iPad, iPad Air & iPad Mini -->
        <link rel="mask-icon" href="src/img/icons/favicon/safari-pinned-tab-icon.svg" color="#424242"/> <!-- MacOS Safari -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-iphone-5-5s-se.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"/> <!-- iPhone 5, iPhone 5s & iPhone SE -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-iphone-6-6s-7-8.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"/> <!-- iPhone 6, iPhone 6s, iPhone 7 & iPhone 8 -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-iphone-plus.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 2)"/> <!-- iPhone 6s Plus, iPhone 7 Plus & iPhone 8 Plus -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-iphone-x-xs.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"/> <!-- iPhone X & iPhone XS -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-iphone-xr.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"/> <!-- iPhone XR -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-iphone-xs-max.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"/> <!-- iPhone XS Max -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-ipad-ipad-mini.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"/> <!-- 7.9" iPad Mini 4 & 9.7" iPad -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-ipad-pro-10-5.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"/> <!-- 10.5" iPad Pro -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-ipad-pro-11.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"/> <!-- 11" iPad Pro -->
        <link rel="apple-touch-startup-image" href="src/img/icons/favicon/apple-touch-startup-image-ipad-pro-12-9.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"/> <!-- 12.9" iPad Pro -->

        <!-- Windows Tags -->
        <meta name="application-name" content="Spume | Real Time" />
        <meta name="msapplication-navbutton-color" content="#343A40" />
        <meta name="msapplication-TileColor" content="#343A40" />
        <meta name="msapplication-TileImage" content="src/img/icons/favicon/mstile-144x144.png" />
        <meta name="msapplication-config" content="browserconfig.xml" />

        <!-- Favicons -->
        <link rel="icon" type="image/png" sizes="32x32" href="src/img/icons/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="src/img/icons/favicon/favicon-16x16.png" />
        <link rel="shortcut icon" type="image/x-icon" href="src/img/icons/favicon/favicon.ico" /> <!-- 16x16 32x32 48x48 -->
        
        <!-- Custom Tags -->
        <meta name='description' content=''/>
        <meta name='author' content='<?=App::devel()?>'/>
        <!-- Scripts -->
        <?php
        IO::js(SCAN,APP);
        IO::js(SCAN,CLIENT);?>
        <!-- Stylesheets -->
        <?php
        IO::css(SCAN,APP);
        IO::css(SCAN,CLIENT);?>
        <title><?=App::project_name()?></title>
    </head>
    <body class='-view -zero -content-center -opensans-light'>

        <?php
        $load = $this->view() ? $this->view() : IO::root() . "/webroot/views/" . strtolower(get_called_class()) . ".php";
        if(is_file($load)) include $load;
        else if($this->result()) echo $this->result();
        else if(DEBUG) Debug::show();?>

    </body>
    <script type="text/javascript">
        (function(){ app&&app.initialize(); })();
    </script>
</html>
