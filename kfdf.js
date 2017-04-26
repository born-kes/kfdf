
var  kfdf = {
    iloraz: false,
    cena : cena_z_tagu_we_wtyczce_kfdf,
    szablon : jQuery('#kfdf_kalkulatorElement .tr:eq(0)').clone(),
    mm : function(){ return !jQuery(".kfdf_input_checkbox", kfdf.table).prop( "checked" ); },
    wiersze : function(){ return jQuery('#kfdf_kalkulatorElement .tr'); },

    loading : function()
    {
        if (! jQuery('#kfdf_kalkulatorElement')) {
            console.log('nie znaleziono elementu');
            return false;
        }
        kfdf.table = jQuery('#kfdf_kalkulatorElement');
        kfdf.tr = jQuery('.tr', this.table);

        console.log('loading', this );
    },
    toggleClass : function(){
        var iloraz
        if( kfdf.mm() )
        {
            iloraz = 10;
            jQuery(kfdf.table).addClass('mm');
        }
        else
        {
            iloraz = 0.1;
            jQuery(kfdf.table).removeClass('mm');
        }
        if(kfdf.iloraz)
        {
        kfdf.set.row(iloraz);
        }
        else
        {
            kfdf.iloraz = true;
        }
    },
    przelicz : function()
    {
        var wiersze = kfdf.wiersze(),
            cenaWiersz = 0,
            sumaCen =0;
        wiersze.each(function(){
            cenaWiersza = kfdf.licz.row(this);
            sumaCen += cenaWiersza;
        });
        if(cenaWiersza>0.01)
        {
            console.log('cenaWiersza->dodaj nowy',cenaWiersza)
            kfdf.nowyWiersz();
        }
        kfdf.set.sumaCen( kfdf.licz.float(sumaCen) );
        console.log('przelicz', wiersze.length)
    },
    nowyWiersz : function (){
        //todo footer_tr global
        var ftr = jQuery('.ftr', kfdf.table);

        var szablon = kfdf.szablon.clone();
        jQuery('input',szablon).change( kfdf.przelicz).val('');
        jQuery( kfdf.table).append( szablon).append(ftr);
    },

    licz : {
        float : function(int){
            return parseInt(int*100)/100;
        },
        pole : function( el )
        {
            if(typeof el.text!=="undefined" && el.text!=='' )
            {
                return kfdf.get.text( el );
            }
            else if( typeof el.value!=="undefined")
            {
                return kfdf.get.value( el );
            }
            else if(el=='')
            {
                el = 0;
            }
            return parseInt(el)*1;
        },
        cene : function( el, pole )
        {
            var cena = kfdf.licz.float( pole * kfdf.cena);
            jQuery('.td:eq(3)',el).text( cena );
            console.log('licz.cene[pole,cena]', [pole , kfdf.cena, cena] );
            return cena;
        },
        row : function (wiersz)
        {
                var input= jQuery('input', wiersz);
                if( input.length!==3)
                    return false;

                var policz = kfdf.licz.pole,
                    iloczyn = kfdf.get.scala(),
                    x, y, sz,
                    pole = 0;

                x = policz( input[0] )/ iloczyn;
                y = policz( input[1] )/ iloczyn;
                sz = policz( input[2] ) * 1;

                pole =  ( x * y ) * sz;

            console.log('licz.row =',[ x, y, sz, pole ], wiersz);

            return kfdf.licz.cene(wiersz, pole);


        },
        visualisation : function()
        {

        }
    },
    get: {
        text : function( el )
        {
            el.text( kfdf.licz.pole( el.text() ) );
            return el.text();
        },
        value : function( el )
        {
            el = jQuery(el);
            el.val( kfdf.licz.pole( el.val() ) );

            return el.val();
        },
        scala : function(){
            console.log('scala', ['true = 1000','false = 100'], kfdf.mm() );
            if( kfdf.mm() ){
               return 1000;
            }
            return 100;
        }
    },
    set : {
        row : function(iloraz)
        {
            var wiersze = kfdf.wiersze();

            wiersze.each(function(){
                var input = jQuery('input', this);

                if(input.length!==3)
                    return false;

                input[0].value *= iloraz  ;
                input[1].value *= iloraz  ;

                console.log('set.row=',input[0], input[0].value);
            });
        },
        sumaCen: function(sumaCen)
        {
            jQuery('.ftr .td:last-child', kfdf.table).text(sumaCen)
        }
    }
}


jQuery(document).ready(function(){
console.log(cena_z_tagu_we_wtyczce_kfdf);
    kfdf.loading();
    jQuery('#kfdf_checkbox input', kfdf.table).change( kfdf.toggleClass );
    jQuery('.tr input', kfdf.table).change( kfdf.przelicz );
//    jQuery('#kfdf_nowy', kfdf.table).click( kfdf.nowyWiersz );

    kfdf.toggleClass()
    kfdf.przelicz();
});