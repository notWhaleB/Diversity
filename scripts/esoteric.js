var timer;
var arr;
var arrPos;
var script;
var bytecode;
var codePos;
var loopStack;
var interpreterState;
var interpreterLanguage;
var interpreterMode;
var iterCount;
var refreshCount;

var BRAINFUCK = 1, MOO = 2, PETOOH = 3;
var DEBUG = 1, NORMAL = 2, PERFORMANCE = 3;
var RUN = 1, PAUSE = 2, STOP = 3, STOPPED = 4, POS_MOVE_LEFT = 5, POS_MOVE_RIGHT = 6;

jQuery.fn.putCursorAtEnd = function() {

    return this.each(function() {

        $(this).focus();

        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.setSelectionRange(len, len);
        } else {
            // ... otherwise replace the contents with itself
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Google Chrome)
        this.scrollTop = 999999;

    });

};

function init() {
    arr = [];
    for (var i = 0; i != 30000; ++i)
        arr[i] = 0;
    arrPos = 0;
    script = "";
    bytecode = [];
    codePos = 0;
    loopStack = [];
    interpreterState = 0;
    interpreterLanguage = 0;
    iterCount = 0;
    refreshCount = 0;
}

function config_interpreter() {
    interpreterLanguage = BRAINFUCK;
    interpreterMode = NORMAL;
    script = $("#editor").val();
    refreshCount = 10000;
}

function update_ui_state() {
    switch(interpreterState) {
        case RUN: {
            $("#run_button").prop("disabled", true);
            $("#pause_button").prop("disabled", false);
            $("#stop_button").prop("disabled", false);
            $("#editor").prop("disabled", true);
            $("#editor_label").addClass("label_disabled");
            $("#buffer_data").prop("disabled", true);
            $("#buffer_data_label").addClass("label_disabled");
            $("#values0").addClass("table_disabled");
            $("tr").addClass("trtd_disabled");
            $("td").addClass("trtd_disabled");
        } break;
        case PAUSE: {
            $("#run_button").prop("disabled", false);
            $("#pause_button").prop("disabled", true);
            $("#stop_button").prop("disabled", false);
            $("#editor").prop("disabled", true);
            $("#editor_label").addClass("label_disabled");
            $("#buffer_data").prop("disabled", false);
            $("#buffer_data_label").removeClass("label_disabled");
            $("#values0").removeClass("table_disabled");
            $("tr").removeClass("trtd_disabled");
            $("td").removeClass("trtd_disabled");
        } break;
        case STOP: {
            $("#run_button").prop("disabled", false);
            $("#pause_button").prop("disabled", true);
            $("#stop_button").prop("disabled", true);
            $("#editor").prop("disabled", false);
            $("#editor_label").removeClass("label_disabled");
            $("#buffer_data").prop("disabled", false);
            $("#buffer_data_label").removeClass("label_disabled");
            $("#values0").addClass("table_disabled");
            $("tr").addClass("trtd_disabled");
            $("td").addClass("trtd_disabled");
        } break;
    }
}

function update_debug_table(curPos) {
    if (curPos >= 0) {
        for (var i = curPos - Math.min(curPos, 3), j = 0; j != 7; ++i, ++j) {
            $("#pos" + j).text(i);
            $("#dec" + j).text(arr[i]);
            $("#chr" + j).text(String.fromCharCode(arr[i]));
        }
    }
}

function interpreter() {
    switch(interpreterLanguage) {
        case BRAINFUCK: {
            brainfuck_bytecode_translator();
            brainfuck_interpreter();
        } break;
    }
}

function interpreter_command(command) {
    switch (command) {
        case RUN: {
            if (interpreterState == STOP) {
                init();
                config_interpreter();
            }
            interpreterState = RUN;
            update_ui_state();
            timer = setTimeout(interpreter, 0);
        } break;
        case PAUSE: {
            interpreterState = PAUSE;
            update_ui_state();
            update_debug_table(arrPos);
        } break;
        case STOP: {
            init();
            interpreterState = STOP;
            update_ui_state();
            update_debug_table(arrPos);
        } break;
        case POS_MOVE_LEFT: {
            update_debug_table(Number($("#pos3").text()) - 1);
        } break;
        case POS_MOVE_RIGHT: {
            update_debug_table(Number($("#pos3").text()) + 1);
        } break;
    }
}

function run() {
    interpreter_command(RUN);
}

function pause() {
    interpreter_command(PAUSE);
}

function stop() {
    interpreter_command(STOP);
}


$(document).ready(function(){
    interpreter_command(STOP);
});
