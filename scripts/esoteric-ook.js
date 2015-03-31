function ook_to_bf_bytecode_translator() {
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

    var arr = [];

    var re = new RegExp("Ook[.?!] Ook[.?!]");
    var current_match = script.match(re);

    while (current_match) {
        arr.push(current_match);
        script = script.replace(current_match, "");
        current_match = script.match(re);
    }

    script = "";
    for (var i = 0; i != arr.length; ++i) {
        script += translate[arr[i]];
    }

    brainfuck_bytecode_translator();
}
