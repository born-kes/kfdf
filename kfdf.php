<?php
    /**
     * Plugin Name: Kalkulator Frontów
     * Plugin URI: xxx
     * Version: 0.1
     * Description: Kalkulator liczy cene w oparciu o wymiary
     * Author: Lukasz Martyn
     * Tag: [KALKULATOR=450]
     */


    define( 'KFDF_TAG', '[KALKULATOR=' );
    define( 'KFDF_VERSION', '0.1' );


    /**
     * Funkcja sprawdza czy treść jest zajawką czy otwartym wpisem
     *
     * @param string $content
     *
     * @internal param bool $more
     *
     * @return string
     */
    function kfdf_testInContent($content='')
    {
        global $more;

        $table_exist = strstr($content, KFDF_TAG)!==false;
        $blocks=array();
        preg_match_all('/\[KALKULATOR=(\d+)\]/', $content, $blocks );
//        var_dump( $blocks[1][0] );die;

        if($more && $table_exist)
        {
            kfdf_script();
            $content = kfdf_renderingTemplate($content, $blocks[0][0], $blocks[1][0] );
        }else{

            $content = kfdf_renderingTemplate($content, $blocks[0][0], null );
        }

        return $content;
    }
    add_action ( 'the_content' , 'kfdf_testInContent');

    /**
     * Podmienia KFDF_TAG na element z kfdf_kalkulatorElement
     *
     * @param string $string
     *
     * @return string
     */
    function kfdf_renderingTemplate( $string, $tag, $cena )
    {
        if(is_null($cena) )
            return str_replace( $tag, '', $string);
//                            KFDF_TAG
        return str_replace( $tag, kfdf_kalkulatorElement($cena), $string);
    }

    /**
     * Element na strone
     *
     * @return string
     */
    function kfdf_kalkulatorElement($cena){

        $str = '
<script type="text/javascript">var cena_z_tagu_we_wtyczce_kfdf='.$cena.';</script>
<h2>Wycena Frontów</h2>
        <div id="kfdf_kalkulatorElement" class="mm">
        <div id="kfdf_checkbox">
            <div> Wymiary w </div>
            <label>
            <input type="checkbox" class="kfdf_input_checkbox">
        <span class="kfdf_label_checkbox"></span>
        </label>
        </div>
            <div class="htr">
                <div class="td">
                    Szerokość
                </div>
                <div class="td">
                    Wysokość
                </div>
                <div class="td">
                    Ilość Sztuk
                </div>
                <div class="td">
                    Cena
                </div>
            </div>
            <div class="tr">
                <div class="td">
                    <input type="number" min="0">
                </div>
                <div class="td">
                    <input type="number" min="0">
                </div>
                <div class="td">
                    <input type="number" value="1">
                </div>
                <div class="td"> 0 </div>
            </div>
            <div class="ftr">
                <div class="td"></div>
                <div class="td"></div>
                <div class="td">
                <!--button id="kfdf_nowy">Dodaj nowy</button-->
                </div>
                <div class="td">
                </div>
            </div>
        </div>
';

        return $str;
    }

    /**
     * Dołącza do strony javascript który obsługuje kalkulator
     *
     * @return void
     */
    function kfdf_script()
    {
//die;
        wp_register_style( 'kfdf.css', plugin_dir_url( __FILE__ ) . 'kfdf.css', array(), KFDF_VERSION );
        wp_enqueue_style( 'kfdf.css');

        wp_register_script( 'kfdf.js', plugin_dir_url( __FILE__ ) . 'kfdf.js', array('jquery'), KFDF_VERSION . 1 );
        wp_enqueue_script( 'kfdf.js' );
    }

// add more buttons to the html editor
    function appthemes_add_quicktags() {
        if (wp_script_is('quicktags')){
            ?>
            <script type="text/javascript">
                QTags.addButton( 'eg_kalkulator', 'kalkulator', '<?php echo KFDF_TAG; ?>', ']', 'cena', 'Kalkulator Frontów' );
            </script>
        <?php
        }
    }
    add_action( 'admin_print_footer_scripts', 'appthemes_add_quicktags' );