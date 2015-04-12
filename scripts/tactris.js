var cells = [];
var cell_hover_calls = [];
var cell_leave_calls = [];
var cell_select_calls = [];
var cell_remove_calls = [];
var mouse_pressed = false;
var button;
var selected_cells_remover;
var occupied_cells_remover_interval;
var score_panel;

var current_shapeform_id = 0;
var next_shapeform_id = 0;

var shapeforms = [];
var shapeforms_delta = [];  //Start point (0, 0) is extreme upper left box point.
var cells_states = [];

var next_preview = [], current_preview = [];

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function occupied_cells_remover() {
    if (cell_remove_calls.length != 0) {
        cells_states[cell_remove_calls[0]] = 0;
        cells[cell_remove_calls[0]].removeClass("cell-occupied");
        cell_remove_calls.shift();
        score_panel.html(parseInt(score_panel.html()) + 1);
    }
    else {
        clearInterval(occupied_cells_remover_interval);
    }
}

function field_processor() {
    var vertical_flag, horizontal_flag;

    for (var i = 0; i != 10; ++i) {
        vertical_flag = true;
        horizontal_flag = true;
        for (var j = 0; j != 10; ++j) {
            if (cells_states[i * 10 + j] != 1) vertical_flag = false;
            if (cells_states[j * 10 + i] != 1) horizontal_flag = false;
        }
        if (vertical_flag) {
            for (var j = 0; j != 10; ++j) {
                cell_remove_calls.push(i * 10 + j);
            }
        }
        if (horizontal_flag) {
            for (var j = 0; j != 10; ++j) {
                cell_remove_calls.push(j * 10 + i);
            }
        }
    }

    score_panel = $('#score-panel');

    occupied_cells_remover_interval = setInterval(function () {
        occupied_cells_remover();
    }, 20);
}

function init_fields() {
    for (var i = 0; i != 10; ++i) {
        for (var j = 0; j != 10; ++j) {
            cells_states[i * 10 + j] = 0;
            var cur_id = i * 10 + j;
            cells[cur_id] = $("#cell_" + i + j);
            cells[cur_id].addClass("cell-free");
            cells[cur_id].addClass("fast-transition");
        }
    }

    for (var i = 0; i != 4; ++i) {
        for (var j = 0; j != 4; ++j) {
            var cur_id = i * 10 + j;
            current_preview[cur_id] = $("#cur-pre-cell_" + i + j);
            current_preview[cur_id].addClass("preview-cell-disabled");
            next_preview[cur_id] = $("#next-pre-cell_" + i + j);
            next_preview[cur_id].addClass("preview-cell-disabled");
        }
    }

    current_shapeform_id = get_random_int(0, 18);
    next_shapeform_id = get_random_int(0, 18);
}

function set_event_listeners() {
    addEventListener("mousedown", function(event) {
        if (event.which == 1) {
            mouse_pressed = true;
            if (selected_cells_remover) {
                clearTimeout(selected_cells_remover);
            }
        }
    });

    addEventListener("mouseup", function(event) {
        if (event.which == 1) {
            mouse_pressed = false;

            var match_with_current = false;
            if (cell_select_calls.length == 4) {
                match_with_current = true;
                var temp = cell_select_calls.slice();
                var min_x = 100, min_y = 100;
                for (var i = 0; i != 4; ++i) {
                    min_x = Math.min(temp[i] % 10, min_x);
                    min_y = Math.min(Math.floor(temp[i] / 10), min_y);
                }
                for (var i = 0; i != 4; ++i) {
                    temp[i] = [Math.floor(temp[i] / 10) - min_y, temp[i] % 10 - min_x];
                }
                temp.sort();

                for (var i = 0; i != 4; ++i) {
                    if (temp[i][0] != shapeforms_delta[current_shapeform_id][i][0] ||
                        temp[i][1] != shapeforms_delta[current_shapeform_id][i][1]) {
                        match_with_current = false;
                    }
                }
            }

            if (match_with_current) {
                for (var i = 0; i != 4; ++i) {
                    cells[cell_select_calls[i]].removeClass("cell-selected");
                    cells[cell_select_calls[i]].addClass("cell-occupied");
                    cells_states[cell_select_calls[i]] = 1;
                }

                current_shapeform_id = next_shapeform_id;
                next_shapeform_id = get_random_int(0, 16);
                set_current_preview();
                field_processor();
            } else {
                selected_cells_remover = setInterval(function () {
                    if (cell_select_calls.length != 0) {
                        cells[cell_select_calls[0]].removeClass("cell-selected");
                        cell_select_calls.shift();
                    } else {
                        clearTimeout(selected_cells_remover);
                    }
                }, 500);
            }
        }
    });
}

function load_shapeforms() {
    $.ajax({
        url: "data/tactris_shapeforms",
        success: function(data) {
            for (var i = 0, j = 0; i != 19; ++i) {
                var buff_0 = [];
                var delta = [];
                for (var p = 0; p != 4; ++p) {
                    var buff_1 = [];
                    for (var q = 0; q != 4; ++q, ++j) {
                        var value = parseInt(data.charAt(j), 10);
                        if (value == 1) {
                            delta.push([q, p]);
                        }
                        buff_1.push(value);
                    }
                    ++j;
                    buff_0.push(buff_1);
                }
                shapeforms.push(buff_0);

                var min_x = 100, min_y = 100;
                for (var p = 0; p != 4; ++p) {
                    min_x = Math.min(delta[p][0], min_x);
                    min_y = Math.min(delta[p][1], min_y);
                }
                for (var p = 0; p != 4; ++p) {
                    delta[p][0] -= min_x;
                    delta[p][1] -= min_y;
                }
                delta.sort();
                shapeforms_delta.push(delta);
            }
            set_current_preview();
        }
    });
}

$(document).ready(function() {

    init_fields();

    set_event_listeners();

    load_shapeforms();
});

function set_current_preview() {
    for (var i = 0; i != 4; ++i) {
        for (var j = 0; j != 4; ++j) {
            var cur_id = i * 10 + j;
            if (shapeforms[current_shapeform_id][j][i] == 1) {
                current_preview[cur_id].removeClass("preview-cell-disabled");
                current_preview[cur_id].addClass("preview-cell-enabled");
            } else {
                current_preview[cur_id].addClass("preview-cell-disabled");
                current_preview[cur_id].removeClass("preview-cell-enabled");
            }
            if (shapeforms[next_shapeform_id][j][i] == 1) {
                next_preview[cur_id].removeClass("preview-cell-disabled");
                next_preview[cur_id].addClass("preview-cell-enabled");
            } else {
                next_preview[cur_id].addClass("preview-cell-disabled");
                next_preview[cur_id].removeClass("preview-cell-enabled");
            }
        }
    }
}

function offline_game_processor() {

}

function cell_hover(id) {
    var cur_id = parseInt(id, 10);

    cells[cur_id].addClass("cell-free-hover");

    if (!cells[cur_id].hasClass("cell-selected")) {
        if (mouse_pressed) {
            cell_selected(cur_id)
        } else {
            cell_hover_calls.push(cur_id);
            setTimeout(function () {
                cells[cell_hover_calls[0]].removeClass("fast-transition");
                cells[cell_hover_calls[0]].addClass("slow-transition");
                cell_hover_calls.shift();
            }, 3);
        }
    }
}

function cell_leave(id) {
    var cur_id = parseInt(id, 10);

    cells[cur_id].removeClass("cell-free-hover");

    if (!cells[cur_id].hasClass("cell-selected")) {
        cell_leave_calls.push(cur_id);
        setTimeout(function () {
            cells[cell_leave_calls[0]].removeClass("slow-transition");
            cells[cell_leave_calls[0]].addClass("fast-transition");
            cell_leave_calls.shift();
        }, 3);
    }
}

function cell_pressed(id) {
    setTimeout(function () {
        if (mouse_pressed) cell_selected(id);
    }, 10);
}

function cell_selected(id) {
    var cur_id = parseInt(id, 10);

    if (!cells[cur_id].hasClass("cell-selected") && cells_states[cur_id] == 0) {
        cells[cur_id].addClass("cell-selected");
        cells[cur_id].removeClass("fast-transition");
        cells[cur_id].addClass("slow-transition");
        cell_select_calls.push(cur_id);
    }

    if (cell_select_calls.length > 4) {
        cells[cell_select_calls[0]].removeClass("cell-selected");
        setTimeout(function() {
            cells[cell_select_calls[0]].removeClass("fast-transition");
            cells[cell_select_calls[0]].addClass("slow-transition");
            cell_select_calls.shift();
        }, 1);
    }
}