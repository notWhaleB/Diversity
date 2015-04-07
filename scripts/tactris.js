var cells = [];
var cell_hover_calls = [];
var cell_leave_calls = [];
var cell_select_calls = [];
var mouse_pressed = false;
var button;
var selected_cells_remover;
var shapeforms = [];

$(document).ready(function(){
    for (var i = 0; i != 10; ++i) {
        for (var j = 0; j != 10; ++j) {
            var cur_id = i * 10 + j;
            cells[cur_id] = $("#cell_" + i + j);
            cells[cur_id].addClass("cell-free");
            cells[cur_id].addClass("fast-transition");
        }
    }

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
            selected_cells_remover = setInterval(function() {
                if (cell_select_calls.length != 0) {
                    cells[cell_select_calls[0]].removeClass("cell-selected");
                    cell_select_calls.shift();
                } else {
                    clearTimeout(selected_cells_remover);
                }
            }, 500);
        }
    });

    $.ajax({
        url: "data/tactris_shapeforms",
        success: function(data) {
            for (var i = 0, j = 0; i != 9; ++i) {
                var buff_0 = [];
                for (var p = 0; p != 4; ++p) {
                    var buff_1 = [];
                    for (var q = 0; q != 4; ++q, ++j) {
                        buff_1.push(parseInt(data.charAt(j), 10));
                    }
                    buff_0.push(buff_1);
                }
                shapeforms.push(buff_0);
            }
        }
    });
});

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

function cell_selected(id) {
    var cur_id = parseInt(id, 10);

    if (!cells[cur_id].hasClass("cell-selected")) {
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
