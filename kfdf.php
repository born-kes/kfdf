<?php
     /*
    Plugin Name: Kalkulator Frontów + plugin Visual Composer
    Description: Kalkulator frontów + plugin dla Visual Composer
    Author: Łukasz Martyn
    see: https://wpbakery.atlassian.net/wiki/pages/viewpage.action?pageId=524332
    Version: 0.5
    */
    define( 'KFDF_VERSION', '0.5' );
	
    if ( ! defined( 'ABSPATH' ) ) {
        die( '-1' );
    }

    define( 'KFDF', '' );

    define( 'KFDF_FILE', dirname( __FILE__ ) . '/' );
    define( 'KFDF_URL', plugin_dir_url( __FILE__) );

$Kfdf_Settings = [
	'cena_za_metr' => [
		"text" => "Cena",
		'description'=> 'Cena za metrkwadratowy',
		'value' => 300
	],
	'style'         => [
		"text" => 'Styl',
		'description'=>  'Wersja wizualna',
		'value'=> [1,2,3],
		'delault' => 3
	],
	'export_order_button' => [
		"text" => 'Nasłuchuje kliknięcia',
		'description'=>  'ID/Class przycisku export:',
		'value'=> ''
	],
	'export_order_respons' => [
		'text' => 'Gdzie wstawić odpowiedz',
		'description'=>  'ID/Class gdzie exportować:',
		'value'=> ''
	],
	'text_export' => [
		'text' => 'Szablon exportowanej treści',
		'description'=>  'Tekst do exportowania danych: %szt %x %y %miara %cena_za_metr %cena',
		'value'=> 'zamówiłeś %szt szt elementów o wymiarach %x %miara wysokości i %y %miara szerokości ' .
		          'w cenie %cena_za_metr zł za metr kwadratowy za cenę %cena zł '
	],
	'delete_ceche'=> [
		'text' => 'Przycisk czyszczenia tabelki i pamięci podręcznej',
		'description'=>  'przykładowe separatory #id .class',
		'value'=> ''
	]
];



define( 'KFDF_URL_JS', KFDF_URL . 'js/kfdf.js' );
wp_register_script( 'kfdf', KFDF_URL_JS , array( 'jquery', 'kfdf_html'), KFDF_VERSION, true );

define( 'KFDF_URL_JS_HTML', KFDF_URL . 'js/jquery.createHtml.min.js' );
wp_register_script( 'kfdf_html', KFDF_URL_JS_HTML , array( 'jquery' ), KFDF_VERSION, true );

define( 'KFDF_URL_JS_EDIT', KFDF_URL . 'js/plugin.js' );
wp_register_script( 'kfdf_js_edit', KFDF_URL_JS_EDIT , array( 'jquery', 'jquery-ui-dialog'), KFDF_VERSION, true  );

define( 'KFDF_URL_CSS', KFDF_URL . 'css/kfdf.css' );
wp_register_style( 'kfdf',  KFDF_URL_CSS, array(), KFDF_VERSION );


require( 'kfdfForm.class.php' );

require( 'shortcode_button.php' );
require( 'shortcode_frontend.php' );
require( 'Widget.class.php' );
require( 'shortcode_vc.php' );