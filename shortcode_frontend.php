<?php

function kfdfConnectScript(){
	kfdfForm::thisForm()->conectScript();
}
add_shortcode('kfdf', 'kfdfConnectScript');

$genID = 0;
if ( !function_exists( 'kfdfFrontTableByShortcode' ) ) {
	function kfdfFrontTableByShortcode($atts)
	{  global $genID;

		$el = kfdfForm::thisForm()->validateDeflaut($atts);

		return kfdfForm::thisForm()->kfdfFinalTable($el, 'kfdf_' . ($genID++), $el['style']);
	}

	add_shortcode('kfdf', 'kfdfFrontTableByShortcode');
	add_filter('widget_text', 'do_shortcode');

}
