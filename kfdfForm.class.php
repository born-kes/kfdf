<?php

class kfdfForm {

	private $settings;

	function __construct( $settings = false ) {
		global $Kfdf_Settings;

		$Kfdf_Settings   = $Kfdf_Settings ? $Kfdf_Settings : [];
		$this->settings = $settings ? $settings : $Kfdf_Settings;
	}

	public static function thisForm() {
		return new kfdfForm;
	}

	/** kfdfInput
	 *
	 * @param $defaultValue
	 * @param $name
	 * @param string $text
	 * @param bool $value
	 *
	 * @return string
	 */
	public function elsemnt( $defaultValue, $name, $value = false ) {
		$str = '';

		if ( is_array( $defaultValue ) ) {
			$str .= $this->select( $name, $defaultValue, $value );
		} else {
			if( strlen ( $value ) > 15)
				$str .= $this->textarea( $name, $defaultValue, $value );
			else
				$str .= $this->input( $name, $defaultValue, $value );
		}

		return $str;
	}


	public function label( $name, $text ) {
		return "<label for='kfdf_{$name}'>{$text}</label>";
	}

	public function description( $description ) {
		return "<p class=\"description\">{$description}</p>";
	}

	public function select( $name, $defaultValue, $value ) {
		$str = '';

		foreach ( $defaultValue as $i => $v ) {
			$str .= "<option value='{$v}'" . ( $v == $value ? ' selected' : '' ) . ">{$v}</option>";
		}
		return "<select class='widefat' id='kfdf_{$name}' name='{$name}'>{$str}</select>";
	}

	public function input( $name, $defaultValue, $value ) {

		$value = $value ? $value : esc_attr( $defaultValue );
		if ( is_numeric( $value ) ) {
			$type = 'number';
		} else {
			$type = 'text';
		}
		return "<input class='widefat' id='kfdf_{$name}' name='{$name}' type='{$type}' value='{$value}' />";
	}
	public function textarea( $name, $defaultValue, $value ) {

		$value = $value ? $value : esc_attr( $defaultValue );
		return "<textarea id='kfdf_{$name}' name='{$name}' style='width: 100%;'>{$value}</textarea>";
	}

	public function activationScript( $id, $atts ) {
		$setting = json_encode( $atts );

		$script = $this->getFile('activationScript');

		$this->replace($script, '{$id}', $id);
		$this->replace($script, '{$setting}', $setting);

		return $script;
	}

	/**
	 *
	 */
	public function conectScript() {
		wp_enqueue_script('jquery');
		wp_enqueue_script('kfdf');
		wp_enqueue_script('kfdf_html');
		wp_enqueue_style('kfdf');
	}

	public function getForm($id, $style) {
		return "<div id='{$id}' class='kfdf_style_{$style}'>".$this->getFile('tableCalculator')."</div>";
	}

	/**
	 * $instance = ['cena_za_metr'=>300,'styl'=>3,'export_order_button'=>'']
	 */
	/** kfdfEditDialog
	 *
	 * @param bool $instance
	 * @param string $class
	 *
	 * @return string
	 */
	public function dialogForm( $instance = [], $class = '' ) {

		$instance = $this->validateDeflaut($instance);

		$str = '<div class="kfdf_edit ' . $class . '" title="Ustawienia Kalkulatora Frontów" style="display:none;">';

		foreach ( $instance as $name => $value ) {
			$text = $this->getSettings( $name,'text');
			$deflautValue = $this->getSettings($name, 'value');
			$description = $this->getSettings( $name,'description');

			$str .= $this->label($name, $text);
			$str .= $this->elsemnt($deflautValue, $name, $value);
			$str .= $this->description($description);
		}
		$str .= '</div>';

		return $str;
	}

	/**
	 * @param $atts
	 * @param string $id
	 * @param int $style
	 * @param string $class
	 * @param string $title
	 *
	 * @return string
	 */
	public function kfdfFinalTable( $atts, $id = 'kfdf_', $style = 3 ) {

		return    $this->getForm ($id, $style)
				. $this->activationScript($id, $atts);

	}

	public function replace(&$string, $needeTag, $text){
		$string = str_replace ( $needeTag, $text, $string );
	}

	public function validate( $attr ) {
		$settings =[];

		foreach ($this->settings as $name => $value) {
			$settings[$name] = $attr[$name]?$attr[$name]:$value['value'];
		}
		return $settings;
	}

	public function validateDeflaut( $attr ) {
		$settings = [];

		foreach ($this->settings as $name => $value) {
			$settings[$name] = isset($attr[$name])?
				$attr[$name]:(
					isset($value['delault'])?
					$value['delault']:$value['value'])
			;
		}
		return $settings;
	}

	public function getFile($name) {

		$this->replace($name, '.','');

		if( file_exists(KFDF_FILE . "file/{$name}.html" ))
		return file_get_contents(KFDF_FILE . "file/{$name}.html");
		return '';
	}

	public function getSettings($name, $value = false) {
		if($value)
		return $this->settings[$name][$value];
		return $this->settings[$name];
	}

}
