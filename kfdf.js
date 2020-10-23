jQuery(function($) {

    $.fn.kfdf = function(options) {

        var basicSettings = {
            czy_mm : false,
            cena_za_metr: 100,
            lokalizacjaSzablonu: '.tr:eq(0)',
            checkbox_mm: "input[type=checkbox]",
            rows: '.tbody .tr',
            titleHeader:[ /*'Szerokość','Wysokość','Ilość Sztuk','Cena'*/ ],
            zarostek: true, // zl/mm/cm/szt
            ilorazStart: 1,
            szablon : '.tbody .tr:eq(0)'

        };

        var methods = {};

        return this.each(function() {
            if (methods[options]) {
                return methods[options].apply( this, arguments );

            } else if (typeof options === 'object' || ! options ) {
                console.log('new __constructor', basicSettings, options );

                var settings = $.extend( basicSettings , options);

                $this = $(this);
                data = $this.data("kfdf");

                if(!data)
                {
                    $this.data("kfdf", settings);
                    $(settings.checkbox_mm, $this).bind("change", clikCheckbox );
                    $('input:not('+settings.checkbox_mm+')', $this).bind("change", changeInput );
                }
                data = $this.data("kfdf");

                data.czy_mm = test_mm(settings.checkbox_mm, $this);
                loading.apply( this, arguments );

            }
            else{
                $.error('kfdf: no method: '+ options);
            }
            console.log('data', $this.data("kfdf") );
        });

        function loading()
        {
            $this = $(this);
            data = $this.data("kfdf");

            $('.thead .tr>div', $this).each(function(nr){
                if(data.titleHeader[nr])
                {
                    $(this).text( data.titleHeader[nr] );
                }
            });

            if(data.zarostek)
            {//.tr>div
                $('.tbody', $this).addClass('zarostek')
            }
            console.log('loaging:',this);

            toggleClass.apply( this, arguments );
            setPrzeliczCene.apply( this, arguments );
//            nowyWiersz.apply( this );

        }

        function test_mm (el, obj)
        {
            console.log('test_mm:',  jQuery(el, obj).length)

            if ( jQuery(el, obj).length>0 )
                return jQuery(el, obj).prop( "checked" );
            return false;
        }

        function changeInput()
        {
            $this = $(this).parents('.table')
            data = $this.data("kfdf");
            console.log('changeInput', data)
            setPrzeliczCene.apply( $this );
        }

        function clikCheckbox(event)
        {
            //Todo cofanie this do .table!!
            toggleClass.apply( $(this).parents('.table'), arguments );
        }

        function toggleClass()
        {
            $this = $(this);
            data = $this.data("kfdf");
            data.czy_mm = test_mm(data.checkbox_mm, $this);

            if ( data.czy_mm ) {
                $this.addClass('mm');
            } else {
                $this.removeClass('mm');
            }
            console.log('toggleClass:', $this, data );

            setPrzeliczeniePol.apply( this, arguments );
            wyliczenieIlorazu.apply( this, arguments );
        }

        function wyliczenieIlorazu(warunek)
        {
            $this = $(this);
            data = $this.data("kfdf");

            if( data.czy_mm ) {
                data.ilorazStart = 0.1
            } else {
                data.ilorazStart = 10
            }
        }

        function setPrzeliczeniePol()
        {
            $this = $(this);
            data = $this.data("kfdf");

            $('.tbody .tr', $this).each(function(){
                var input = $('input', this);

                console.log('setPrzeliczeniePol-input:', input);
                if(input.length!==3)
                    return false;

                input[0].value *= data.ilorazStart  ;
                input[1].value *= data.ilorazStart  ;

            });

        }

        function getText( el )
        {
            el.text( getPole( el.text() ) );
            return el.text();
        }

        function getValue( el )
        {
            el = $(el);
            el.val( getPole( el.val() ) );

            return el.val();
        }

        function getScala()
        {
            $this = $(this).parents('.table');
            data = $this.data("kfdf");

            if( data.czy_mm ){
                return 1000;
            }
            return 100;
        }

        function getPole( el )
        {
            console.log( el );
            if(typeof el.text!=="undefined" && el.text!=='' )
            {
                return getText( el );
            }
            else if( typeof el.value!=="undefined")
            {
                return getValue( el );
            }
            else if(el=='')
            {
                el = 0;
            }
            return parseInt(el)*1;
        }

        function getPoleRow()
        {
            var input = $('input', this);

            if(input.length!==3)
                return false;

            console.log( getPole );
            var iloczyn = getScala.apply( this ),
                x = getPole.apply( this,[ input[0] ] ) / iloczyn,
                y = getPole.apply( this,[ input[1] ] ) / iloczyn,
                sz = getPole.apply( this,[ input[2] ] ) * 1,

                pole =  ( x * y ) * sz;

            return pole;
            console.log('', [x,y,sz,iloczyn,'=',pole]);

        }

        function getSzablon()
        {
            $this = $(this);
            data = $this.data("kfdf");
            return $(data.szablon,$this).clone();
        }

        function setFloat(int){
            return parseInt(int*100)/100;
        }

        function setPrzeliczCene()
        {
            $this = $(this);
            data = $this.data("kfdf");
            var cena = 0,
                sumaCen = 0;

            $('.tbody .tr', $this).each(function(){
                cena = 0;
                var pole = getPoleRow.apply(this);
                cena = setFloat( (pole * data.cena_za_metr) , 2 );
                sumaCen += cena;

                console.log('setPrzeliczCene Row', pole, cena);
                $('div:eq(3)',this).text( cena );
            });
            if(cena>0) {
                nowyWiersz.apply(this);
            }

            $('.tfooter .tr>div:eq(3)', $this).text( setFloat(sumaCen) )
            console.log('setPrzeliczCene',cena, data);
        }
        function nowyWiersz()
        {

            $this = $(this);
            data = $this.data("kfdf");

            var szablon = getSzablon.apply(this);
//            jQuery('input',szablon).change( kfdf.przelicz).val('');
            nowyWierszCline.apply(szablon);
            $( '.tbody').append( szablon);
        }

        function nowyWierszCline()
        {
            $('input', this)
                .val('')
                .bind("change", changeInput )
                .eq(2).val(1);
            $('div:eq(3)', this).text(0);
        }

    }
});
console.log = function(a){}