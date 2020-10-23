<?php
    if ( ! defined( 'ABSPATH' ) || ! defined( 'KFDF' )  ) {
        die( '-1' );
    }
    function typeByVc($value) {
    	if (is_array($value) )
    		return "dropdown";
    	if (strlen ( $value ) > 15)
    		return "textarea";
	    return "textfield";
    }

    function settingsByVc($settings){
	    $settingsByVc = [];
	    foreach ($settings as $name => $value) {
	    	$settingsByVc[] = [
			    "type" => typeByVc($value['value']),
			    "heading" => $value['text'],
			    'admin_label' => true,
			    'param_name' => $name,
			    'description' => $value['description'],
			    'value' => $value['value']
		    ];
	    }
	    return $settingsByVc;
    }

    /**
     * Current visual composer version
     */
    if ( defined( 'WPB_VC_VERSION' ) ) {

        if(function_exists('vc_map'))
        vc_map(
            array(
                "name"      =>  "Kalkulator Frontów dla vc",
                'description' => 'kalkulator' ,
                "base"      => "kfdf",
                "category"  => __( 'kfdf' ),
                'icon'      => 'vc_icon-vc-media-grid',
//                "admin_enqueue_css" => KFDF_URL_CSS . '?' . KFDF_VERSION,
                "params"            => settingsByVc($Kfdf_Settings)
            )
        );

    }

