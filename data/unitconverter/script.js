function AppUnitconverter() {
    this.AREA = 0; this.LENGTH = 1;
    this.converter_state = -1;
    this.converters = [undefined];

    this.init = function() {
        this.converters[this.AREA] = new UnitconverterArea();
        this.converters[this.LENGTH] = new UnitconverterLength();
        this.update_state(1);
    };

    this.update_state = function(base) {
        if (this.update_converter_state()) {
            this.update_unit_selectors();
        }
        var base_value = $("#unitconverter-value-" + base).val();
        var base_unit = this.converters[this.converter_state][$("#unitconverter-unit-selector-" + base).val()];
        for (var i = 1; i <= 4; ++i) {
            if (i != base) {
                $("#unitconverter-value-" + i).val(this.converters[this.converter_state].convert(base_value, base_unit,
                    this.converters[this.converter_state][$("#unitconverter-unit-selector-" + i).val()]));
            }
        }

    };

    this.update_converter_state = function() {
        var prev = this.converter_state;
        this.converter_state = this[$("#unitconverter-value-selector").val()];

        return this.converter_state != prev;
    };

    this.update_unit_selectors = function() {
        var options_html = this.converters[this.converter_state].options_html();
        for (var i = 1; i <= 4; ++i) {
            $("#unitconverter-unit-selector-" + i).html(options_html);
        }
    };

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("unitconverter-header");
        _header.children().slice(0,1).addClass("unitconverter-header");
        _header.children().slice(1,2).addClass("unitconverter-header");
        $("#title").html("Unit converter");
        $("title").html("Unit converter");
    };

    this.transform = "translate(0, -200vh)";
    this.html_path = "unitconverter.html";
}

function UnitconverterArea() {
    this.HECT = 0; this.ACRE = 1; this.SQKM = 2; this.SQM = 3; this.SQCM = 4; this.SQMM = 5;
    this.units = ["HECT", "ACRE", "SQKM", "SQM", "SQCM", "SQMM"];
    this.unit_names = ["Hectare", "Acre", "Square Kilometer", "Square Meter", "Square Centimetr", "Square Millimeter"];
    // Pivot_unit: SQM - Square Meter

    this.options_html = function() {
        var res = "";
        for (var i = 0; i != this.units.length; ++i) {
            res += "<option value='" + this.units[i] + "'>" + this.unit_names[i] + "</option>";
        }
        return res;
    };

    this.to_pivot = function(value, source_unit) {
        switch (source_unit) {
            case this.HECT: {
                return 10000 * value;
            } break;
            case this.ACRE: {
                return 100 * value;
            } break;
            case this.SQKM: {
                return 1000000 * value;
            } break;
            case this.SQM: {
                return value;
            } break;
            case this.SQCM: {
                return 0.0001 * value;
            } break;
            case this.SQMM: {
                return 0.000001 * value;
            }
        }
    };

    this.from_pivot = function(value, output_unit) {
        switch (output_unit) {
            case this.HECT: {
                return 0.0001 * value;
            } break;
            case this.ACRE: {
                return 0.01 * value;
            } break;
            case this.SQKM: {
                return 0.000001 * value;
            } break;
            case this.SQM: {
                return value;
            } break;
            case this.SQCM: {
                return 10000 * value;
            } break;
            case this.SQMM: {
                return 1000000 * value;
            }
        }
    };

    this.convert = function(value, source_unit, output_unit) {
        if ($.isNumeric(value))
            return this.from_pivot(this.to_pivot(value, source_unit), output_unit);
    }
}

function UnitconverterLength() {
    this.M = 0; this.KM = 1; this.CM = 2; this.MM = 3; this.YARD = 4; this.FOOT = 5; this.INCH = 6; this.MILE = 7; this.NAMI = 8;
    this.units = ["M", "KM", "CM", "MM", "YARD", "FOOT", "INCH", "MILE", "NAMI"];
    this.unit_names = ["Meter", "Kilometer", "Centimetr", "Millimeter", "Yard", "Foot", "Inch", "Mile", "Nautical Mile"];
    // Pivot_unit: M - Meter

    this.options_html = function() {
        var res = "";
        for (var i = 0; i != this.units.length; ++i) {
            res += "<option value='" + this.units[i] + "'>" + this.unit_names[i] + "</option>";
        }
        return res;
    };

    this.to_pivot = function(value, source_unit) {
        switch (source_unit) {
            case this.M: {
                return value;
            } break;
            case this.KM: {
                return 1000 * value;
            } break;
            case this.CM: {
                return 0.01 * value;
            } break;
            case this.MM: {
                return 0.001 * value;
            } break;
            case this.YARD: {
                return 0.914 * value;
            } break;
            case this.FOOT: {
                return 0.3048 * value;
            } break;
            case this.INCH: {
                return 0.0254 * value;
            } break;
            case this.MILE: {
                return 1609.2693 * value;
            } break;
            case this.NAMI: {
                return 1851.8518 * value;
            } break;
        }
    };

    this.from_pivot = function(value, output_unit) {
        switch (output_unit) {
            case this.M: {
                return value;
            } break;
            case this.KM: {
                return 0.001 * value;
            } break;
            case this.CM: {
                return 100 * value;
            } break;
            case this.MM: {
                return 1000 * value;
            } break;
            case this.YARD: {
                return 1.094 * value;
            } break;
            case this.FOOT: {
                return 3.281 * value;
            } break;
            case this.INCH: {
                return 39.37 * value;
            } break;
            case this.MILE: {
                return 0.0006214 * value;
            } break;
            case this.NAMI: {
                return 0.00054 * value;
            } break;
        }
    };

    this.convert = function(value, source_unit, output_unit) {
        if ($.isNumeric(value))
            return this.from_pivot(this.to_pivot(value, source_unit), output_unit);
    }
}