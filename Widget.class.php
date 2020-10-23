<?php
/**
 * https://developer.wordpress.org/themes/functionality/widgets/
 */
class Widget extends WP_Widget {

	private $form;

	public function __construct() {

        parent::__construct('kfdf_widget','Kalkulator Frontów ',
            array( 'description' => 'Prosty widget, kalkulatora metrów kwadratowych do liczenia ceny Frontów Moblowych', )
        );

        $this->form = new kfdfForm;

    }

	/** Creating widget front-end
     *
	 */
    public function widget( $args, $atts ) {
        $this->form->conectScript();
        echo $this->form->kfdfFinalTable($atts, $args['widget_id'], $atts['style']);
    }

// Widget Backend
    public function form( $instance ) {
        $settings = $this->form->validate($instance);

        echo $this->editForm($settings);

    }

// Updating widget replacing old instances with new
    public function update( $new_instance, $old_instance ) {
       return $this->form->validate($new_instance);
    }

	private function editForm($settings) {

        $respons = '';

		foreach ($settings as $key => $value) {
			$name = $this->get_field_name($key);
			$text = $this->form->getSettings($key,'text');
			$description = $this->form->getSettings($key,'description');
			$deflautValue = $this->form->getSettings($key,'value');

			$respons .= $this->form->label( $name, $text );
			$respons .= $this->form->elsemnt($deflautValue, $name, $value);
			$respons .= $this->form->description($description);

        }
        return $respons;

	}
}

function kfdf_load_widget() {
	register_widget( 'Widget' );
}
add_action( 'widgets_init', 'kfdf_load_widget' );

