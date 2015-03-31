var HQ_HELLOWORLD = 0, HQ_PRINTCODE = 1, HQ_99BOTTLES = 2, HQ_INC = 3;
var hq_variable = 0;

function hq9plus_bytecode_translator() {
    for (var i = 0; i != script.length; ++i) {
        switch (script.charAt(i)) {
            case 'H': bytecode.push(HQ_HELLOWORLD); break;
            case 'Q': bytecode.push(HQ_PRINTCODE); break;
            case '9': bytecode.push(HQ_99BOTTLES); break;
            case '+': bytecode.push(HQ_INC); break;
        }
    }
}

function hq9plus_processor(instruction) {
    var output_window = $("#output_window");
    switch (instruction) {
        case HQ_HELLOWORLD:
            output_window.val(output_window.val() + "Hello, World!\n");
            break;
        case HQ_PRINTCODE:
            output_window.val(output_window.val() + script + "\n");
            break;
        case HQ_99BOTTLES:
            for (var i = 99; i != 0; --i) {
                output_window.val(output_window.val() +
                i.toString() + " bottles of beer on the wall\n" +
                i.toString() + " bottles of beer!\n" +
                "Take one down, pass it around\n" +
                (i - 1).toString() + " bottles of beer on the wall!" + "\n\n");
            }
            break;
        case HQ_INC:
            hq_variable++;
            break;
    }
}

function hq9plus_interpreter() {
    while (codePos < bytecode.length && interpreterState == RUN) {
        hq9plus_processor(bytecode[codePos]);
        if (iterCount >= refreshCount || bytecode[codePos] != HQ_INC) {
            codePos++;
            iterCount = 0;
            break;
        }
        codePos++;
        iterCount++;
    }

    $("#output_window").putCursorAtEnd();

    if (interpreterState == RUN && codePos < bytecode.length) {
        timer = setTimeout(hq9plus_interpreter, 0);
    } else if (interpreterState != PAUSE) {
        interpreter_command(STOP);
    }
}


