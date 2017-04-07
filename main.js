$(document).ready(function(){
    $('#add-new-show').click(function(){

        // dodanie ciemnego t�a
        $('body').prepend('<div id="cover">&nbsp;</div>');
        // wy�wietlenie podformularza
        $("#add-new-subform").css({'display': 'block'});

        $("#add-new-save").click(function(){
            var new_occupation = $("#new-occupation").val();
            if(typeof new_occupation !== "undefined" && new_occupation){
                // dodanie nowego rekordu do bazy oraz wpisu w polu select
                addNewOccupation(new_occupation);
                // usuni�cie ciemnego t�a i ukrycie podformularza
                $('#cover').remove();
                $("#add-new-subform").css({'display': 'none'});
            };
        });

        $("#add-new-cancel").click(function(){
            // usuni�cie ciemnego t�a i ukrycie podformularza
            $('#cover').remove();
            $("#add-new-subform").css({'display': 'none'});
        });
    });
    var okleina_checkbox = $('#cal_img input[type=checkbox]');
});

function addNewOccupation(new_occupation){
    // tutaj za pomoca AJAX mozna doda� do bazy nowy rekord
    // zapytanie powinno zwr�ci� id nowego zawodu
    var id = 100;	// id nowego zawodu dodanego do bazy
    $("#occupation").append(new Option(new_occupation,id));
    $("#occupation").val(id);
}

$('#kalkulator').click(
function(){
    kalkulator();
    $('body').prepend('<div id="cover">&nbsp;</div>');
    $( "#dialog" ).dialog({close:function(){ $('#cover').remove();},width:440});
}
);
/*

<form action="" method="post">
    <div class="field">
        <label for="person">Osoba</label>
        <input type="text" name="person" id="person" value=""/>
    </div>
    <div id="add-new-subform">
        <input type="text" value="" name="new-occupation" id="new-occupation" />
        <input type="button" value="Dodaj" id="add-new-save" />
        <input type="button" value="Anuluj" id="add-new-cancel" />
    </div>
    <div class="field">
        <label for="occupation">Zaw�d</label>
        <select name="occupation" id="occupation">

        </select>
        <input type="button" value="+" id="add-new-show" />
    </div>
    <div class="field">
        <label for="information">Uwagi</label>
        <textarea name="information" id="information" rows="5" cols="10"></textarea>
    </div>
    <div>
        <input type="submit" value="Zapisz" />
    </div>
</form>*/
var _plyta_x = $('#plyta_x'),
    _plyta_y = $('#plyta_y'),
    _plyta_c = $('#plyta_c'), //cena

    _okleina_1 = $('#okleina_1'),
    _okleina_2 = $('#okleina_2'),
    _okleina_3 = $('#okleina_3'),
    _okleina_4 = $('#okleina_4'),
    _okleina_5 = $('#okleina_5'),
    _okleina_6 = $('#okleina_6'),
    _okleina_7 = $('#okleina_7'),

    obwod = 0,
    ilosc_mk = 0,
    cena_za_mk = 0,



    formatka_x = $('#formatka_x'),
    formatka_y = $('#formatka_y'),
    formatka_c = $('#formatka_c'),
    okleina_checkbox = $('#cal_img input[type=checkbox]'),
    selectList = $('#okleina_select');

function kalkulator(){
    var plyta_x = _plyta_x.val()/1000,
        plyta_y = _plyta_y.val()/1000,
        plyta_c = _plyta_c.val(), //cena

        okleina_1 =_okleina_1.val(),
        okleina_2 =_okleina_2.val(),
        okleina_3 =_okleina_3.val(),
        okleina_4 =_okleina_4.val(),
        okleina_5 =_okleina_5.val(),
        okleina_6 =_okleina_6.val(),
        okleina_7 =_okleina_7.val();

    console.log('[plyta_x,plyta_y,plyta_c]:' , [plyta_x, plyta_y, plyta_c] );
    ilosc_mk = parseInt((plyta_x * plyta_y)*100)/100;
    console.log('ilosc_mk',ilosc_mk);

    cena_za_mk = parseInt(plyta_c/ilosc_mk*100)/100;
    console.log('cena_za_mk', cena_za_mk)

    $('#c_m2').text(cena_za_mk);

var select = [];

    selectList.children().remove();

    $('#okleina input').each(function(nr,b){

        if(b.value !== ''){
            var option = document.createElement("option");
            option.setAttribute("value", $(b).val() );
            option.text = $('#okleina label:eq('+nr+')').text();
            selectList.append(option);
        }
    });
    liczymy();
}

function liczymy(){

    /* Liczymy */

        formatka_okleina = 0;

    console.log( formatka_x.val(), formatka_y.val(), (formatka_x.val()*formatka_y.val())/10000, cena_za_mk);
    formatka_c.val( (formatka_x.val()*formatka_y.val())/10000 * cena_za_mk);

}

$(document).ready(function(){
    okleina_checkbox.click(function(){

        console.log(obwod, formatka_x, formatka_y);

        if(this.checked){
            if($(this).val()=='bok')
            {
                obwod+= parseInt( formatka_x.val() );
            }else{
                obwod+= parseInt( formatka_y.val() );
            }
        }else{
            if( $(this).val()=='bok' )
            {
                obwod-= parseInt( formatka_x.val() );
            }else{
                obwod-= parseInt( formatka_y.val() );
            }
        }

        if(obwod<0)
            obwod=0;

var cena_mb = parseInt( selectList.val() )/100 ;

        $('#okleina_dlugosc').val( obwod );
        $('#okleina_cena').val( obwod*cena_mb );


        console.log(
            cena_mb,
            selectList.val(),
            obwod
        );
    });
});