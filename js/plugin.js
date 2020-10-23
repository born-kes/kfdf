var kfdf_form = '.kfdf_edit:first',

    WPkfdf = {
        settings : {},
        init : function (ed, url) {
            ed.addCommand ( 'button_kfdf_cmd', function () {
                WPkfdf.edit (ed);
            });
            ed.addButton('kfdf', {
                title : 'Kalkulator Frontów',
                text : 'kfdf',
                cmd : 'button_kfdf_cmd'
            });
        },
        edit : function (ed) {
            kfdf_dialog(function (odp) {
                ed.selection.setContent(odp);
            }, ed);
        },
        createControl: function () {
            return null;
        },
    };

function kfdf_get_data(){
    let odp ='';
    jQuery('input, select, textarea', this).each(function (nr, el) {
        if(jQuery(this).val() != '')
            odp += ' '+ jQuery(this).attr('name') +'="'+ jQuery(this).val()+'"';
    });
    return odp;
}
function kfdfCallback (def) {
    return (def)?"[kfdf cena_za_metr=301 style=3]":"[kfdf" + kfdf_get_data.apply(this,[]) + "]";
}
function kfdf_dialog(callback, el)
{
    jQuery(kfdf_form).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Domyślny": function () {
                callback( kfdfCallback(true), el);
                jQuery(this).dialog("close");
            },
            "Wstaw z danymi": function () {
                callback( kfdfCallback.apply(this, [false]), el);
                jQuery(this).dialog("close");
            },
            Anuluj: function () {
                jQuery(this).dialog("close");
            }
        }
    });
}
/**
 *  Wersja tekstowa
 */
function kfdf_callback_form() {
    let kfdfCallback = function (odp){QTags.insertContent(odp);};
    kfdf_dialog ( kfdfCallback );
}
// if(typeof QTags == "object")
QTags.addButton(
    "code_kfdf",
    "kfdf",
    kfdf_callback_form
);
/**
 *  Wersja Wizualna
 */
setTimeout(function() {
    tinymce.create('tinymce.plugins.kfdf', WPkfdf);
    tinymce.PluginManager.add('kfdf', tinymce.plugins.kfdf);
},0);