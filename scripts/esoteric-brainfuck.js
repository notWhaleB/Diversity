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

            if (interpreterMode == DEBUG) debug_log("Cell #" + arrPos.toString() + " incremented, new value: " + arr[arrPos].toString());
        } break;
        case BF_DEC: {
            if (arr[arrPos] == 0)
                arr[arrPos] = 256;
            arr[arrPos]--;
            if (interpreterMode == DEBUG) debug_log("Cell #" + arrPos.toString() + " decremented, new value: " + arr[arrPos].toString());
        } break;
        case BF_INCPTR: {
            arrPos++;

            if (interpreterMode == DEBUG) debug_log("Move '->' from cell #" + (arrPos - 1).toString() + " to cell #" + arrPos.toString());
        } break;
        case BF_DECPTR: {
            arrPos--;

            if (interpreterMode == DEBUG) debug_log("Move '<-' from cell #" + (arrPos + 1).toString() + " to cell #" + arrPos.toString());
        } break;
        case BF_LOOPB: {
            if (interpreterMode == DEBUG) debug_log("Beginning of the loop, symbol #" + codePos.toString() + ", under cell #" + arrPos.toString());

            if (arr[arrPos] != 0) {
                loopStack.push(codePos);

                if (interpreterMode == DEBUG) debug_log("Cell value: " + arr[arrPos].toString() + " -- non-zero, entry into loop");
            } else {
                var stack = 1;
                while (stack != 0 && codePos != bytecode.length) {
                    codePos++;
                    if (bytecode[codePos] == BF_LOOPE)
                        stack--;
                    else if (bytecode[codePos] == BF_LOOPB)
                        stack++;
                }
                if (interpreterMode == DEBUG) debug_log("Cell value equal to zero, pass loop, move to symbol #" + codePos.toString());
            }
        } break;
        case BF_LOOPE: {
            var newPos = loopStack[loopStack.length - 1] - 1;
            if (interpreterMode == DEBUG) debug_log("End of the loop, symbol #" + codePos.toString() + ", move to beginning at symbol #" + newPos.toString());

            codePos = newPos;
            loopStack.pop();
        } break;
        case BF_READ: {
            if (buffer_data.val().length == 0) {
                switch (interpreterEOBAction) {
                    case EOB_EOF: {
                        arr[arrPos] = 0;

                        if (interpreterMode == DEBUG) debug_log("Read data, buffer is empty, send EOF");
                    } break;
                    case EOB_PAUSE: {
                        if (interpreterMode == DEBUG) debug_log("Read data, buffer is empty, call pause, waiting for input");
                        codePos--;
                        interpreter_command(PAUSE);
                    } break;
                }
            } else {
                arr[arrPos] = buffer_data.val().charCodeAt(0);
                read_data.val(read_data.val() + String.fromCharCode(arr[arrPos]));
                buffer_data.val(buffer_data.val().slice(1));

                if (interpreterMode == DEBUG) debug_log("Read char '" + String.fromCharCode(arr[arrPos]) + "' (char code " + arr[arrPos].toString() + "), write to cell #" + arrPos.toString());
            }
        } break;
        case BF_WRITE: {
            output_window.val(output_window.val() + String.fromCharCode(arr[arrPos]));

            if (interpreterMode == DEBUG) debug_log("Write to output from cell #" + arrPos.toString() + ", char '" + String.fromCharCode(arr[arrPos]) + "' (char code " + arr[arrPos].toString() + ")");
        } break;
        case BF_BREAKPOINT: {
            interpreter_command(PAUSE);

            if (interpreterMode == DEBUG) debug_log("Breakout point found")
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

    output_window.putCursorAtEnd();

    if (interpreterState == RUN && codePos < bytecode.length) {
        timer = setTimeout(brainfuck_interpreter, 0);
    } else if (interpreterState != PAUSE) {
        interpreter_command(STOP);
    }
}
