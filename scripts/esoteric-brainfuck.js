var BF_INC = 0, BF_DEC = 1, BF_INCPTR = 2, BF_DECPTR = 3, BF_LOOPB = 4, BF_LOOPE = 5, BF_READ = 6, BF_WRITE = 7;
var BF_BREAKPOINT = 8;

function brainfuck_bytecode_translator() {
    for (var i = 0; i != script.length; ++i) {
        switch (script.charAt(i)) {
            case '+': bytecode.push(BF_INC); break;
            case '-': bytecode.push(BF_DEC); break;
            case '>': bytecode.push(BF_INCPTR); break;
            case '<': bytecode.push(BF_DECPTR); break;
            case '[': bytecode.push(BF_LOOPB); break;
            case ']': bytecode.push(BF_LOOPE); break;
            case ',': bytecode.push(BF_READ); break;
            case '.': bytecode.push(BF_WRITE); break;
            case '@': bytecode.push(BF_BREAKPOINT); break;
        }
    }
}

function brainfuck_processor(instruction) {
    switch (instruction) {
        case BF_INC: {
            arr[arrPos]++;
            arr[arrPos] %= 256;
        } break;
        case BF_DEC: {
            if (arr[arrPos] == 0)
                arr[arrPos] = 256;
            arr[arrPos]--;
        } break;
        case BF_INCPTR: arrPos++; break;
        case BF_DECPTR: arrPos--; break;
        case BF_LOOPB: {
            if (arr[arrPos] != 0)
                loopStack.push(codePos);
            else {
                var stack = 1;
                while (stack != 0 && codePos != bytecode.length) {
                    codePos++;
                    if (bytecode[codePos] == BF_LOOPE)
                        stack--;
                    else if (bytecode[codePos] == BF_LOOPB)
                        stack++;
                }
            }
        } break;
        case BF_LOOPE: {
            codePos = loopStack[loopStack.length - 1] - 1;
            loopStack.pop();
        } break;
        case BF_READ: {
            var buffer_data = $("#buffer_data");
            if (buffer_data.val().length == 0) {
                arr[arrPos] = 0;
            } else {
                var read_data = $("#read_data");
                arr[arrPos] = buffer_data.val().charCodeAt(0);
                read_data.val(read_data.val() + String.fromCharCode(arr[arrPos]));
                buffer_data.val(buffer_data.val().slice(1));
            }
        } break;
        case BF_WRITE: {
            var output_window = $("#output_window");
            output_window.val(output_window.val() + String.fromCharCode(arr[arrPos]));
        } break;
        case BF_BREAKPOINT: {
            interpreter_command(PAUSE);
        } break;
    }
}

function brainfuck_interpreter() {
    while (codePos < bytecode.length && interpreterState == RUN) {
        brainfuck_processor(bytecode[codePos]);
        if (iterCount >= refreshCount || bytecode[codePos] == BF_WRITE) {
            codePos++;
            iterCount = 0;
            break;
        }
        codePos++;
        iterCount++;
    }

    $("#output_window").putCursorAtEnd();

    if (interpreterState == RUN && codePos < bytecode.length) {
        timer = setTimeout(brainfuck_interpreter, 0);
    } else if (interpreterState != PAUSE) {
        interpreter_command(STOP);
    }
}
