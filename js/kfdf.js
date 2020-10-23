if (typeof jQuery === 'undefined') {
} else {
    jQuery(function ($) {

        $.fn.kfdf = function (options, value) {

            let basicSettings = {
                cena_za_metr: 100,
                checkbox: "input[type=checkbox]:first",
                col: ['x', 'y', 'szt', 'cena'],
                sizeScale: 1,
                model: '.tbody .tr:eq(0)',
                save_order_button: '.save',
                delete_ceche: '',
                export_order_button: '.export',
                export_order_respons: 'textarea',
                text_export: "zamówiłeś %szt szt elementów o wymiarach %x %miara wysokości i %y %miara szerokości " +
                'w cenie %cena_za_metr zł za metr kwadratowy za cenę %cena zł '
            };

            let methods = {
                buildTable: function (el) {

                    [$this, data] = getDataKfdf(el);

                    let table, caption, thead, tbody, tfooter;
                    table = $($this).$div({class: "table"});

                    caption = table.$divClass("caption");
                    caption.$div("Wymiary w ");
                    caption.$label().$input({type: "checkbox"}).parents().$span();

                    //thead =
                    table.$divClass("thead")
                        .$divClass("tr")
                        .divClass(["col0", "col1", "col2", "col3"]);
                    tbody = table.$divClass("tbody")
                        .$divClass("tr");
                    tbody.divClass(["td", "td", "td", "td cena"]);
                    $(".td", tbody).$input({type: "number", min: "0"});
                    // tfooter =
                    table.$divClass("tfooter")
                        .$divClass("tr")
                        .divClass(["td", "td", "td", "td sumaCen"]);
                }
            };

            function loadingData() {
                const dataCache = getStorage.apply(this);

                if ($(dataCache).length > 0) {
                    putStorage.apply(this, [dataCache]);
                }
            }

            function getStorage() {
                return JSON.parse(localStorage.getItem('kfdfElement' + $(this).attr('id')));
            }

            function putStorage(dataCache) {
                let rowTable = $('.tbody .tr', this).length;
                for (let i = 0, rowCache = $(dataCache).length; i < (rowCache - rowTable); i++) {
                    putNewRow.apply(this);
                }
                $('.tbody .tr', this).each(function (nr) {
                    if (dataCache[nr])
                        $('input', this).each(function (i) {
                            if (dataCache[nr][i])
                                $(this).val(dataCache[nr][i]);
                        });
                });
            }

            function setStorage() {
                let rowsCache = [];
                $('.tbody .tr', this).each(function (nr) {

                    let rowCache = [];
                    if (parseInt($('.cena', this).text()) > 0) {
                        $('input', this).each(function (i) {
                            rowCache[i] = $(this).val();
                        });
                        rowsCache.push(rowCache);
                    }
                });
                localStorage.setItem('kfdfElement' + $(this).attr('id'), JSON.stringify(rowsCache));
            }

            return this.each(function () {
                if (methods[options]) {
                    return methods[options].apply(this, [value]);
                }
                else if (typeof options === 'object' || !options) {

                    let
                        anchor = $(this).hasClass('kfdf_div'),
                        tableExist = ($(this).children().length !== 0),
                        settings = $.extend(basicSettings, options);

                    $(this).data(getID(this), settings);
                    if (!anchor) {
                        $(this).addClass('kfdf_div');
                    }
                    if (!tableExist) {
                        methods.buildTable.apply(this, $(this));
                    }

                    loadingData.apply(this);

                    loading.apply(this, settings);
                    $(this).show(500);
                }
                else {
                    $.error('kfdf: no method: ' + options);
                }
            });

            function loading() {
                let [$this, data] = getDataKfdf(this);

                if (data.checkbox) {
                    $(data.checkbox, $this).bind("change", setClassBySize);

                    $('input', $this).not(data.checkbox).bind("change", inputChange);
                }
                if (data.export_order_button) {
                    $(data.export_order_button).bind("click", [$this, data], exportOrder);
                }
                if (data.save_order_button) {
                    $(data.save_order_button).bind("click", function () {
                        console.log('mojeCiasteczko', 'jegoWartosc');
                        return false;
                    });
                }
                if (data.delete_ceche) {
                    $(data.delete_ceche).bind("click", function () {
                        deleteLocalStorage($this);
                        return false;
                    });
                }

                setClassBySize.apply(this);
                setConvertCene.apply(this);
            }

            function setSizeScale() {
                [$this, data] = getDataKfdf(this);

                if (testCheckboxChecked.apply(this)) {
                    data.sizeScale = 0.1
                } else {
                    data.sizeScale = 10
                }
            }

            function putConvertInputBySize() {
                [$this, data] = getDataKfdf(this);

                $('.tbody .tr', $this).each(function () {
                    let input = $('input', this);

                    if (input.length !== 3)
                        return false;

                    input[0].value *= data.sizeScale;
                    input[1].value *= data.sizeScale;

                });
            }

            function getScala() {
                if (testCheckboxChecked.apply(this)) {
                    return 1000;
                }
                return 100;
            }

            function getScopeRow() {
                let input, scala, x, y, szt;
                input = $('input', this);
                scala = getScala.apply(this);
                x = input[0].value / scala;
                y = input[1].value / scala;
                szt = input[2].value * 1;
                return (x * y) * szt;
            }

            function getCenaRow(el) {
                let [, data] = getDataKfdf(el);
                let scope = getScopeRow.apply(this);
                return getFloat((scope * data.cena_za_metr), 2);
            }

            function getModel() {
                [$this, data] = getDataKfdf(this);
                return $(data.model, $this).clone();
            }

            function getFloat(int) {
                return parseInt(int * 100) / 100;
            }

            function putNewRow() {
                [$this, data] = getDataKfdf(this);

                let newRow = getModel.apply(this);
                setClineInput(newRow);
                $('.tbody', $this).append(newRow);
            }

            function setClineInput(row) {
                $('input', row)
                    .val('')
                    .bind("change", inputChange)
                    .eq(2).val(1);
                $('div:eq(3)', row).text(0);
            }

            function setClassBySize() {
                [$this, data] = getDataKfdf(this);
                if (testCheckboxChecked.apply(this)) {
                    $this.addClass('mm');
                } else {
                    $this.removeClass('mm');
                }
                putConvertInputBySize.apply($this);
                setSizeScale.apply($this);
            }

            function setConvertCene() {
                let [$this,] = getDataKfdf(this),
                    cena = 0,
                    sumaCen = 0;

                $('.tbody .tr', $this).each(function () {
                    sumaCen += cena = getCenaRow.apply(this, [$this]);
                    putCenaRow.apply(this, [cena]);
                });
                putSumaCena.apply($this, [sumaCen]);
                setStorage.apply($this, [sumaCen]);

                if (cena > 0) {
                    putNewRow.apply(this);
                }
            }

            function testCheckboxChecked() {
                let [$this, data] = getDataKfdf(this);
                if ($(data.checkbox, $this).length > 0)
                    return $(data.checkbox, $this).prop("checked");
                return false;
            }

            function getDataKfdf(obj) {
                let $this = $(obj);
                if (!$this.hasClass('kfdf_div')) {
                    $this = $this.parents('.kfdf_div');
                }
                return [$this, getData($this)];
            }

            function getID(obj) {
                let id = $(obj).attr('id');
                if (typeof(id) === 'undefined') {
                    id = 'kfdf_div_' + parseInt(Math.random() * 100);
                    $(obj).attr('id', id);
                }
                return id;
            }

            function getData(obj) {
                let data,
                    id = getID(obj);
                if ((data = $(obj).data(id))) {
                    return data;
                }
                else {
                    console.error('getData off', obj);
                }

            }

            function exportOrder(event) {
                let formatka = [],
                    [$this, data] = event.data;

                $('.tbody .tr', $this).each(function (nr) {

                    let sum = $('div:eq(3)', this).text() * 1;
                    if (!(sum > 0)) return;

                    formatka[nr] = exportData.apply($this, [data]);
                    formatka[nr][data.col[3]] = sum;
                    $('input', this).each(function (i) {
                        formatka[nr][data.col[i]] = $(this).val();
                    });
                });
                let str = "\n";
                $(formatka).each(function () {
                    str += replaceData(data.text_export, this);
                });

                $(data.export_order_respons).val($(data.export_order_respons).val() + str);

                return false;
            }

            function exportData(data) {
                return {
                    miara: (testCheckboxChecked.apply(this) ? 'mm ' : 'cm '),
                    cena_za_metr: (data.cena_za_metr + 'zł ')
                };
            }

            function replaceData(str, val) {
                return str.replace(new RegExp("%([a-z0-9_]+)?", "g"), function (match, index) {
                    return val[index];
                });
            }

            function putCenaRow(cena) {
                $('.cena', this).text(cena);
            }

            function putSumaCena(sumaCen) {
                $('.sumaCen', this).text(getFloat(sumaCen));
            }

            function inputChange() {
                let [$this,] = getDataKfdf(this);
                setConvertCene.apply($this);
            }

            function deleteLocalStorage($this) {
                localStorage.removeItem('kfdfElement' + $this.attr('id'));
                $('.tbody .tr', $this).each(function () {
                    setClineInput(this);
                });
            }
        }
    });

    (function ($, window, document, undefined) {
        function dd(el, className) {
            return $(el).$div({class: className});
        }

        $.fn['$divClass'] =
            $.fn.divClass = function (value) {
                let _this = this;
                if (typeof value === 'object') {
                    return $(value).each(function (i, value) {
                        return dd(_this, value);
                    });
                } else {
                    return dd(_this, value);
                }
                return _this;
            };
    })(jQuery, window, document);
}