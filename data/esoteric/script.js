var _esoteric = undefined;

function AppEsoteric() {
    this.timer = undefined; this.arr = undefined; this.arrPos = undefined; this.script = undefined;
    this.bytecode = undefined; this.codePos = undefined; this.loopStack = undefined; this.interpreterState = undefined;
    this.interpreterLanguage = undefined; this.interpreterMode = undefined; this.interpreterEOBAction = undefined;
    this.iterCount = undefined; this.refreshCount = undefined;

    this.buffer_data = undefined; this.read_data = undefined; this.output_window = undefined; this.debug_log_output = undefined;

    this.BRAINFUCK = 1; this.OOK = 4; this.HQ9PLUS = 5;
    this.DEBUG = 1; this.NORMAL = 2;
    this.RUN = 1; this.PAUSE = 2; this.STOP = 3; this.POS_MOVE_LEFT = 5; this.POS_MOVE_RIGHT = 6;
    this.EOB_EOF = 1; this.EOB_PAUSE = 2;

    this._bf = undefined;
    this._ook = undefined;
    this._hq9plus = undefined;

    jQuery.fn.putCursorAtEnd = function() {

        return this.each(function() {
            $(this).focus();
            if (this.setSelectionRange) {
                var len = $(this).val().length * 2;
                this.setSelectionRange(len, len);
            } else {
                $(this).val($(this).val());
            }

            this.scrollTop = 999999;
        });
    };

    this._init = function() {
        this.arr = [];
        for (var i = 0; i != 30000; ++i) {
            this.arr[i] = 0;
        }
        this.arrPos = 0;
        this.script = "";
        this.bytecode = [];
        this.codePos = 0;
        this.loopStack = [];
        this.interpreterState = 0;
        this.interpreterLanguage = 0;
        this.iterCount = 0;
        this.refreshCount = 0;
    };

    this.config_interpreter = function() {
        var _lang = $("#esoteric-language-selector").val();
        switch (_lang) {
            case "BRAINFUCK": this.interpreterLanguage = this.BRAINFUCK; break;
            case "OOK": this.interpreterLanguage = this.OOK; break;
            case "HQ9PLUS": this.interpreterLanguage = this.HQ9PLUS; break;
        }

        var _mode = $("#esoteric-interpreter-mode").val();
        switch (_mode) {
            case "NORMAL": {
                this.interpreterMode = this.NORMAL;
                this.refreshCount = 10000;
            } break;
            case "DEBUG": {
                this.interpreterMode = this.DEBUG;
                this.refreshCount = 10;
            } break;
        }

        var _eob = $("#esoteric-eob-action-selector").val();
        switch(_eob) {
            case "EOF": this.interpreterEOBAction = this.EOB_EOF; break;
            case "PAUSE": this.interpreterEOBAction = this.EOB_PAUSE; break;
        }

        this.script = $("#esoteric-editor").val();
    };

    this.update_ui_state = function() {
        switch(this.interpreterState) {
            case this.RUN: {
                $("#esoteric-run-button").prop("disabled", true);
                $("#esoteric-pause-button").prop("disabled", false);
                $("#esoteric-stop-button").prop("disabled", false);
                $("#esoteric-editor").prop("disabled", true);
                $("#esoteric-editor-label").addClass("esoteric-label-disabled");
                $("#esoteric-buffer-data").prop("disabled", true);
                $("#esoteric-buffer-data-label").addClass("esoteric-label-disabled");
                $("#esoteric-values0").addClass("esoteric-table-disabled");
                $("#esoteric-values0-label").addClass("esoteric-label-disabled");
                $(".esoteric-tr").addClass("esoteric-trtd-disabled");
                $(".esoteric-td").addClass("esoteric-trtd-disabled");
            } break;
            case this.PAUSE: {
                $("#esoteric-run-button").prop("disabled", false);
                $("#esoteric-pause-button").prop("disabled", true);
                $("#esoteric-stop-button").prop("disabled", false);
                $("#esoteric-editor").prop("disabled", true);
                $("#esoteric-editor-label").addClass("esoteric-label-disabled");
                $("#esoteric-buffer-data").prop("disabled", false);
                $("#esoteric-buffer-data-label").removeClass("esoteric-label-disabled");
                $("#esoteric-values0").removeClass("esoteric-table-disabled");
                $("#esoteric-values0-label").removeClass("esoteric-label-disabled");
                $(".esoteric-tr").removeClass("esoteric-trtd-disabled");
                $(".esoteric-td").removeClass("esoteric-trtd-disabled");
            } break;
            case this.STOP: {
                $("#esoteric-run-button").prop("disabled", false);
                $("#esoteric-pause-button").prop("disabled", true);
                $("#esoteric-stop-button").prop("disabled", true);
                $("#esoteric-editor").prop("disabled", false);
                $("#esoteric-editor-label").removeClass("esoteric-label-disabled");
                $("#esoteric-buffer-data").prop("disabled", false);
                $("#esoteric-buffer-data-label").removeClass("esoteric-label-disabled");
                $("#esoteric-values0").addClass("esoteric-table-disabled");
                $("#esoteric-values0-label").addClass("esoteric-label-disabled");
                $(".esoteric-tr").addClass("esoteric-trtd-disabled");
                $(".esoteric-td").addClass("esoteric-trtd-disabled");
            } break;
        }
    };

    this.update_debug_table = function(curPos) {
        if (curPos >= 0) {
            for (var i = curPos - Math.min(curPos, 3), j = 0; j != 7; ++i, ++j) {
                $("#esoteric-pos" + j).text(i);
                $("#esoteric-dec" + j).text(this.arr[i]);
                $("#esoteric-chr" + j).text(String.fromCharCode(this.arr[i]));
            }
        }
    };

    this.debug_log = function(output) {
        this.debug_log_output.val(this.debug_log_output.val() + "\n" + output);
        this.debug_log_output.putCursorAtEnd();
    };

    this.interpreter = function() {
        switch(this.interpreterLanguage) {
            case this.BRAINFUCK: {
                this.bytecode = [];
                this._bf.brainfuck_bytecode_translator();
                this._bf.brainfuck_interpreter();
            } break;
            case this.OOK: {
                this._ook.ook_to_bf_bytecode_translator();
                this._bf.brainfuck_interpreter();
            } break;
            case this.HQ9PLUS: {
                this._hq9plus.hq9plus_bytecode_translator();
                this._hq9plus.hq9plus_interpreter();
            } break;
        }
    };

    this.interpreter_command = function(command) {
        switch (command) {
            case this.RUN: {
                if (this.interpreterState == this.STOP) {
                    this._init();
                    this.config_interpreter();
                }
                this.interpreterState = this.RUN;
                this.config_interpreter();
                this.update_ui_state();

                this.timer = setTimeout(function() {
                    diversity.apps[DIVERSITY_APP_ESOTERIC].interpreter();
                }, 0);

                this.debug_log("Interpreter started");
            } break;
            case this.PAUSE: {
                this.interpreterState = this.PAUSE;
                this.update_ui_state();
                this.update_debug_table(this.arrPos);

                this.debug_log("Interpreter paused");
            } break;
            case this.STOP: {
                this._init();
                this.interpreterState = this.STOP;
                this.update_ui_state();
                this.update_debug_table(this.arrPos);

                this.debug_log("Interpreter stopped\n");
            } break;
            case this.POS_MOVE_LEFT: {
                this.update_debug_table(Number($("#esoteric-pos3").text()) - 1);
            } break;
            case this.POS_MOVE_RIGHT: {
                this.update_debug_table(Number($("#esoteric-pos3").text()) + 1);
            } break;
        }
    };

    this.run = function() {
        this.interpreter_command(this.RUN);
    };

    this.pause = function() {
        this.interpreter_command(this.PAUSE);
    };

    this.stop = function() {
        this.interpreter_command(this.STOP);
    };

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("esoteric-header");
        _header.children().slice(0,1).addClass("esoteric-header");
        _header.children().slice(1,2).addClass("esoteric-header");
        $("title").html("Esoteric interpreter");
        $("#title").html("Esoteric interpreter");
    };

    this.init = function() {
        this.buffer_data = $("#esoteric-buffer-data");
        this.read_data = $("#esoteric-read-data");
        this.output_window = $("#esoteric-output-window");
        this.debug_log_output = $("#esoteric-debug-log");


        this._bf = new EsotericBrainfuck();
        this._ook = new EsotericOok();
        this._hq9plus = new EsotericHQ9plus();

        this.debug_log("Interpreter ready");
        this.interpreter_command(this.STOP);
        _esoteric = diversity.apps[DIVERSITY_APP_ESOTERIC];
    };

    this.transform = "translate(-200vw, -100vh)";
    this.html_path = "esoteric.html";
}

function EsotericBrainfuck() {
    this.BF_INC = 0; this.BF_DEC = 1; this.BF_INCPTR = 2; this.BF_DECPTR = 3; this.BF_LOOPB = 4;
    this.BF_LOOPE = 5; this.BF_READ = 6; this.BF_WRITE = 7; this.BF_BREAKPOINT = 8;

    this.brainfuck_bytecode_translator = function() {
        for (var i = 0; i != _esoteric.script.length; ++i) {
            switch (_esoteric.script.charAt(i)) {
                case '+': _esoteric.bytecode.push(this.BF_INC); break;
                case '-': _esoteric.bytecode.push(this.BF_DEC); break;
                case '>': _esoteric.bytecode.push(this.BF_INCPTR); break;
                case '<': _esoteric.bytecode.push(this.BF_DECPTR); break;
                case '[': _esoteric.bytecode.push(this.BF_LOOPB); break;
                case ']': _esoteric.bytecode.push(this.BF_LOOPE); break;
                case ',': _esoteric.bytecode.push(this.BF_READ); break;
                case '.': _esoteric.bytecode.push(this.BF_WRITE); break;
                case '@': _esoteric.bytecode.push(this.BF_BREAKPOINT); break;
            }
        }
    };

    this.brainfuck_processor = function(instruction) {
        switch (instruction) {
            case _esoteric._bf.BF_INC: {
                _esoteric.arr[_esoteric.arrPos]++;
                _esoteric.arr[_esoteric.arrPos] %= 256;
                ///////
                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Cell #" + _esoteric.arrPos.toString() + " incremented, new value: " + _esoteric.arr[_esoteric.arrPos].toString());
            } break;
            case _esoteric._bf.BF_DEC: {
                if (_esoteric.arr[_esoteric.arrPos] == 0)
                    _esoteric.arr[_esoteric.arrPos] = 256;
                _esoteric.arr[_esoteric.arrPos]--;
                ///////
                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Cell #" + _esoteric.arrPos.toString() + " decremented, new value: " + _esoteric.arr[_esoteric.arrPos].toString());
            } break;
            case _esoteric._bf.BF_INCPTR: {
                _esoteric.arrPos++;
                ///////
                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Move '->' from cell #" + (_esoteric.arrPos - 1).toString() + " to cell #" + _esoteric.arrPos.toString());
            } break;
            case _esoteric._bf.BF_DECPTR: {
                _esoteric.arrPos--;
                ///////
                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Move '<-' from cell #" + (_esoteric.arrPos + 1).toString() + " to cell #" + _esoteric.arrPos.toString());
            } break;
            case _esoteric._bf.BF_LOOPB: {
                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Beginning of the loop, symbol #" + _esoteric.codePos.toString() + ", under cell #" + _esoteric.arrPos.toString());

                if (_esoteric.arr[_esoteric.arrPos] != 0) {
                    _esoteric.loopStack.push(_esoteric.codePos);

                    if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Cell value: " + _esoteric.arr[_esoteric.arrPos].toString() + " -- non-zero, entry into loop");
                } else {
                    var stack = 1;
                    while (stack != 0 && _esoteric.codePos != _esoteric.bytecode.length) {
                        _esoteric.codePos++;
                        if (_esoteric.bytecode[_esoteric.codePos] == _esoteric._bf.BF_LOOPE)
                            stack--;
                        else if (_esoteric.bytecode[_esoteric.codePos] == _esoteric._bf.BF_LOOPB)
                            stack++;
                    }
                    if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Cell value equal to zero, pass loop, move to symbol #" + _esoteric.codePos.toString());
                }
            } break;
            case _esoteric._bf.BF_LOOPE: {
                var newPos = _esoteric.loopStack[_esoteric.loopStack.length - 1] - 1;
                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("End of the loop, symbol #" + _esoteric.codePos.toString() + ", move to beginning at symbol #" + newPos.toString());

                _esoteric.codePos = newPos;
                _esoteric.loopStack.pop();
            } break;
            case _esoteric._bf.BF_READ: {
                if (_esoteric.buffer_data.val().length == 0) {
                    switch (_esoteric.interpreterEOBAction) {
                        case _esoteric.EOB_EOF: {
                            _esoteric.arr[_esoteric.arrPos] = 0;

                            if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Read data, buffer is empty, send EOF");
                        } break;
                        case _esoteric.EOB_PAUSE: {
                            if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Read data, buffer is empty, call pause, waiting for input");
                            _esoteric.codePos--;
                            _esoteric.interpreter_command(_esoteric.PAUSE);
                        } break;
                    }
                } else {
                    _esoteric.arr[_esoteric.arrPos] = _esoteric.buffer_data.val().charCodeAt(0);
                    _esoteric.read_data.val(_esoteric.read_data.val() + String.fromCharCode(_esoteric.arr[_esoteric.arrPos]));
                    _esoteric.buffer_data.val(_esoteric.buffer_data.val().slice(1));

                    if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Read char '" + String.fromCharCode(_esoteric.arr[_esoteric.arrPos]) + "' (char code " + _esoteric.arr[_esoteric.arrPos].toString() + "), write to cell #" + _esoteric.arrPos.toString());
                }
            } break;
            case _esoteric._bf.BF_WRITE: {
                _esoteric.output_window.val(_esoteric.output_window.val() + String.fromCharCode(_esoteric.arr[_esoteric.arrPos]));

                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Write to output from cell #" + _esoteric.arrPos.toString() + ", char '" + String.fromCharCode(_esoteric.arr[_esoteric.arrPos]) + "' (char code " + _esoteric.arr[_esoteric.arrPos].toString() + ")");
            } break;
            case _esoteric._bf.BF_BREAKPOINT: {
                _esoteric.interpreter_command(_esoteric.PAUSE);

                if (_esoteric.interpreterMode == _esoteric.DEBUG) _esoteric.debug_log("Breakout point found")
            } break;
        }
    };

    this.brainfuck_interpreter = function() {
        while (_esoteric.codePos < _esoteric.bytecode.length && _esoteric.interpreterState == _esoteric.RUN) {
            this.brainfuck_processor(_esoteric.bytecode[_esoteric.codePos]);
            if (_esoteric.iterCount >= _esoteric.refreshCount || _esoteric.bytecode[_esoteric.codePos] == _esoteric._bf.BF_WRITE) {
                _esoteric.codePos++;
                _esoteric.iterCount = 0;
                break;
            }
            _esoteric.codePos++;
            _esoteric.iterCount++;
        }

        _esoteric.output_window.putCursorAtEnd();

        if (_esoteric.interpreterState == _esoteric.RUN && _esoteric.codePos < _esoteric.bytecode.length) {
            _esoteric.timer = setTimeout(function() {
                _esoteric._bf.brainfuck_interpreter();
            }, 0);
        } else if (_esoteric.interpreterState != _esoteric.PAUSE) {
            _esoteric.interpreter_command(_esoteric.STOP);
        }
    }
}

function EsotericHQ9plus() {
    this.HQ_HELLOWORLD = 0; this.HQ_PRINTCODE = 1; this.HQ_99BOTTLES = 2; this.HQ_INC = 3;
    this.hq_variable = 0;

    this.hq9plus_bytecode_translator = function() {
        for (var i = 0; i != _esoteric.script.length; ++i) {
            switch (_esoteric.script.charAt(i)) {
                case 'H': _esoteric.bytecode.push(this.HQ_HELLOWORLD); break;
                case 'Q': _esoteric.bytecode.push(this.HQ_PRINTCODE); break;
                case '9': _esoteric.bytecode.push(this.HQ_99BOTTLES); break;
                case '+': _esoteric.bytecode.push(this.HQ_INC); break;
            }
        }
    };

    this.hq9plus_processor = function(instruction) {
        var output_window = $("#esoteric-output-window");
        switch (instruction) {
            case _esoteric._hq9plus.HQ_HELLOWORLD:
                output_window.val(output_window.val() + "Hello, World!\n");
                break;
            case _esoteric._hq9plus.HQ_PRINTCODE:
                output_window.val(output_window.val() + _esoteric.script + "\n");
                break;
            case _esoteric._hq9plus.HQ_99BOTTLES:
                for (var i = 99; i != 0; --i) {
                    output_window.val(output_window.val() +
                    i.toString() + " bottles of beer on the wall\n" +
                    i.toString() + " bottles of beer!\n" +
                    "Take one down, pass it around\n" +
                    (i - 1).toString() + " bottles of beer on the wall!" + "\n\n");
                }
                break;
            case _esoteric._hq9plus.HQ_INC:
                this.hq_variable++;
                break;
        }
    };

    this.hq9plus_interpreter = function() {
        while (_esoteric.codePos < _esoteric.bytecode.length && _esoteric.interpreterState == _esoteric.RUN) {
            this.hq9plus_processor(_esoteric.bytecode[_esoteric.codePos]);
            if (_esoteric.iterCount >= _esoteric.refreshCount || _esoteric.bytecode[_esoteric.codePos] != this.HQ_INC) {
                _esoteric.codePos++;
                _esoteric.iterCount = 0;
                break;
            }
            _esoteric.codePos++;
            _esoteric.iterCount++;
        }

        $("#esoteric-output-window").putCursorAtEnd();

        if (_esoteric.interpreterState == _esoteric.RUN && _esoteric.codePos < _esoteric.bytecode.length) {
            _esoteric.timer = setTimeout(function() {
                _esoteric._hq9plus.hq9plus_interpreter();
            }, 0);
        } else if (_esoteric.interpreterState != _esoteric.PAUSE) {
            _esoteric.interpreter_command(_esoteric.STOP);
        }
    }
}

function EsotericOok() {
    this.ook_to_bf_bytecode_translator = function() {
        var translate = [];
        translate["Ook. Ook."] = '+';
        translate["Ook! Ook!"] = '-';
        translate["Ook. Ook?"] = '>';
        translate["Ook? Ook."] = '<';
        translate["Ook! Ook?"] = '[';
        translate["Ook? Ook!"] = ']';
        translate["Ook! Ook."] = '.';
        translate["Ook. Ook!"] = ',';
        translate["Ook? Ook?"] = '@';  // Breakpoint command

        var arr = []; var re = new RegExp("Ook[.?!] Ook[.?!]");
        var current_match = _esoteric.script.match(re);

        while (current_match) {
            arr.push(current_match);
            _esoteric.script = _esoteric.script.replace(current_match, "");
            current_match = _esoteric.script.match(re);
        }

        _esoteric.script = "";
        for (var i = 0; i != arr.length; ++i) {
            _esoteric.script += translate[arr[i]];
        }

        _esoteric._bf.brainfuck_bytecode_translator();
    }
}




