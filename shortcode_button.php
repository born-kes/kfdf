<?php
// Przycisk i function dla Edytora
function add_button($plugin_array) {

    $plugin_array['kfdf'] = KFDF_URL_JS_EDIT;
    $plugin_array['createHtml'] = KFDF_URL_JS_HTML;
	return $plugin_array;
}

function register_button($buttons) {
	array_push($buttons, "kfdf");
	array_push($buttons, 'codebutton' );
	return $buttons;
}

function code_button() {
        add_filter('mce_external_plugins', 'add_button');
        add_filter('mce_buttons',   'register_button');

}
add_action('init', 'code_button');

/*
 * dodaje skrytp do footer
 *
 * @see: http://qnimate.com/post-series/create-a-wordpress-post-editor-button-to-add-shortcode/#prettyPhoto
 */
function shortcode_button_script()
{
    if(wp_script_is("quicktags"))
    {
	    echo kfdfForm::thisForm()->dialogForm();
    }
}

function load_custom_wp_admin_scripts ($hook) {
	if($hook === 'post.php') {
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'jquery-ui-dialog' );
		wp_enqueue_script( 'kfdf_js_edit' );
		wp_enqueue_style( 'wp-jquery-ui-dialog' );

		add_action("admin_print_footer_scripts", "shortcode_button_script");
	}
}
add_action ('admin_enqueue_scripts', 'load_custom_wp_admin_scripts');