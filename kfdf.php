<?php
    /*
    Plugin Name: Kalkulator Frontów dla Visual Composer
    Description: Wersja kalkulator frontów dydykowana dla Visual Composer
    Version: 0.2
    Author: Łukasz Martyn
    */
    define( 'KFDF', '' );
    define( 'KFDF_FILE', dirname( __FILE__ ).'\\' );

    vc_map( array(
            "name" => __("Kalkulator Frontów dla vc"),
            "base" => "kfdf_base",
            "category" => __('kfdf'),
            "class" => '.table',
            'icon' => 'vc_icon-vc-media-grid',
//            "css" => plugin_dir_url( __FILE__ ).'/kfdf.css',
//            "admin_enqueue_css" => plugin_dir_url( __FILE__ ).'/kfdf.css',
//            "admin_enqueue_js" => plugin_dir_url( __FILE__ ).'test.js',
            "params" => array(
                array(
                    "type" => "textfield",
                    "holder" => "div",
                    "class" => "",
                    "heading" => __("Title"),
                    "param_name" => "title",
                    "value" => 'Wycena Frontów',
                    "description" => "Nagłówek"
                ),
                array(
                    "type" => "textfield",
                    "holder" => "div",
                    "class" => "",
                    "heading" => __("Cena"),
                    "param_name" => "cena",
                    "description" => "Cena metra kwadratowego do wyliczeń"
                ),
                array(
                    "type" => "dropdown",
                    "holder" => "div",
                    "class" => "",
                    "heading" => __("Styl kalkulatora"),
                    "param_name" => "style",
                    "value" => array(
                        'brak'=>'',
                        'styl #1'=>'style_1',
                        'styl #2'=>'style_2',
                        'styl #3'=>'style_3'
                    ),
//                    'group' => 'Wygląd'
                ),
//                array(
//                    'type' => 'checkbox',
//                    'heading' => 'Skróty',
//                    'param_name' => 'view_mm',
//                    'description' =>  'Widoczne typy w komórkach (cm/mm, szt).',
//                    "checked"=>'checked',
//                    'group' => 'Wygląd'
//                ),
                /*
                array(
                    "type" => "textarea",
                    "holder" => "div",
                    "class" => "",
                    "heading" => 'Własny css',
                    "param_name" => "content",
                    "value" => "",
                    "description" => 'Tabelka wstawiana do wyliczeń.',
                    'group' => 'Wygląd'
                ),
                //*/
                /*
              / array(
                    "type" => "css_editor",
                    "holder" => "div",
                    "class" => "",
                    "heading" => __("css"),
                    "param_name" => "css",
                    'group' => 'css'
                ) //*/
            )
        ) );





    add_shortcode('kfdf_base', 'shortcode_html');

    function shortcode_html($atts, $content = null, $class = null){

//var_dump($atts, $content, $class, dirname( __FILE__ ));

        extract( shortcode_atts( array(
                    'title'     =>  '',
                    'cena'     =>  '',
                    'style'    =>  '',
                    'view_mm'  =>  '',
                    'content'  =>  '',
//                    'css'      =>  ''
                ), $atts ) );

        $class = ( $class != '' ) ? esc_attr( $class ) : '';
        $title = ( $title != '' ) ? esc_attr( $title ) : '';
        $cena = ( $cena != '' ) ? esc_attr( $cena ) : 0;
        $name = ( $name != '' ) ? $name : "YES";
        $description = ( $description != '' ) ? esc_attr( $description ) : '';
        $group_name = ( $group_name != '' ) ? esc_attr( $group_name ) : 'public';
        $theme = ( $theme != '' ) ? esc_attr( $theme ) : 'Dark';


        $output = '<div class="kfdf_dvi '. $class .' kfdf_'. $style .'">';
        $output .= '<h2>' . $title . '</h2>';
        $output .= file_get_contents(KFDF_FILE . 'kfdf.html');
        $output.= '
       <link rel=\'stylesheet\' href=\''. plugin_dir_url( __FILE__ ) .'table.css\' type=\'text/css\' media=\'all\' />
       <link rel=\'stylesheet\' href=\''. plugin_dir_url( __FILE__ ) .'kfdf.css\' type=\'text/css\' media=\'all\' />


        <script src="'. plugin_dir_url( __FILE__ ).'kfdf.js"></script>
        <script type="text/javascript">
        jQuery(document).ready(function(){

            jQuery(\'#kfdf_kalkulatorElement\').kfdf({cena_za_metr:'.$cena.'});
            jQuery(\'.kfdf_dvi\').addClass(\'animate bounceIn\');
        });
    </script>';
        $output .= '</div>';
        return $output;
    }