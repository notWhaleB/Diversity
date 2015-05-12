var content;
var floodit_cells = [];
var field_size = 0;
var steps = 0;
var steps_limit = 0;
var floodit_active = false;
var colors = ["#2ecc71", "#3498db", "#9b59b6", "#e74c3c", "#f1c40f", "#ecf0f1"];

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function set_event_listeners() {
    addEventListener("keypress", function(event) {
        if (floodit_active) {
            switch (event.which) {
                case 49: turn_color_to(0); break;
                case 50: turn_color_to(1); break;
                case 51: turn_color_to(2); break;
                case 52: turn_color_to(3); break;
                case 53: turn_color_to(4); break;
                case 54: turn_color_to(5); break;
            }
        }
    });
}

function update_steps_counter() {
    $("#floodit-steps-counter").html("Steps: " + steps.toString() + "/" + steps_limit);
}

function load_main_dialog() {
    $.ajax({
        url: "data/floodit/floodit-main-dialog.html",
        success: function(data) {
            content.children().first().remove();
            content.append(data);
        }
    });
}

function load_configure_new_game_dialog() {
    $.ajax({
        url: "data/floodit/floodit-configure-new-game-dialog.html",
        success: function(data) {
            content.children().remove();
            content.append(data);
        }
    });
}

function load_game() {
    $.ajax({
        url: "data/floodit/floodit-game.html",
        success: function(data) {
            floodit_cells = [];
            field_size = parseInt($("#floodit-size-selector").val());
            steps = 0;
            steps_limit = Math.floor(field_size * 1.7);

            content.children().first().remove();
            content.append(data);

            var field_html = "";
            for (var i = 0; i != field_size; ++i) {
                field_html = "";
                field_html += "<tr>\n";
                for (var j = 0; j != field_size; ++j) {
                    field_html += '<td class="floodit-cell" id="floodit-cell_' + j.toString() + "_" + i.toString() + '"></td>';
                }
                field_html += "</tr>\n";
                $("#floodit-gamefield").append(field_html);
            }
            var floodit_cell_class = $(".floodit-cell");
            floodit_cell_class.css("width", (480 / field_size).toString() + "px");
            floodit_cell_class.css("height", (480 / field_size).toString() + "px");

            for (var i = 0; i != field_size; ++i) {
                floodit_cells.push([]);
                for (var j = 0; j != field_size; ++j) {
                    floodit_cells[i].push($("#floodit-cell_" + i.toString() + "_" + j.toString()));
                }
            }

            for (var i = 0; i != field_size; ++i) {
                for (var j = 0; j != field_size; ++j) {
                    floodit_cells[i][j].val(get_random_int(0, 5));
                    floodit_cells[i][j].css("backgroundColor", colors[floodit_cells[i][j].val()]);
                }
            }

            update_steps_counter();
            floodit_active = true;
        }
    });
}

function load_game_over_dialog() {
    floodit_active = false;
    $.ajax({
        url: "data/floodit/floodit-game-over.html",
        success: function(data) {
            content.append(data);

            setTimeout(function() {
                $("#floodit-game-over-content").addClass("floodit-game-over-content-focus");
                $("#floodit-game-over-wrapper").addClass("floodit-game-over-wrapper-focus");
                $("#floodit-game-over-dialog-text").html("You've done in " + steps.toString() + " of " + steps_limit.toString() + " steps.");
            }, 100);
        }
    });
}

function reload_game() {
    $("#floodit-game-over-content").removeClass("floodit-game-over-content-focus");
    $("#floodit-game-over-wrapper").removeClass("floodit-game-over-wrapper-focus");

    setTimeout(function() {
        load_configure_new_game_dialog();
    }, 500);

}

function turn_color_to(new_color) {
    floodit_active = false;
    var old_color = floodit_cells[0][0].val();
    if (old_color == new_color) return;

    var traversal_queue = [];
    traversal_queue.push([0, 0]);
    floodit_cells[0][0].val(-1);
    var shift_x = [0, 0, -1, 1];
    var shift_y = [-1, 1, 0, 0];

    while (traversal_queue.length != 0) {
        var current = traversal_queue[0];
        var cur_x = current[0], cur_y = current[1];
        traversal_queue.shift();
        for (var p = 0; p != 4; ++p) {
            var next_x = cur_x + shift_x[p], next_y = cur_y + shift_y[p];
            if (0 <= next_x && next_x < field_size &&
                0 <= next_y && next_y < field_size &&
                floodit_cells[next_x][next_y].val() == old_color) {
                traversal_queue.push([next_x, next_y]);
                floodit_cells[next_x][next_y].val(-1);
            }
        }
    }

    var complete_cells = 0;
    for (var i = 0; i != field_size; ++i) {
        for (var j = 0; j != field_size; ++j) {
            if (floodit_cells[i][j].val() == new_color) {
                complete_cells++;
            }
            if (floodit_cells[i][j].val() == -1) {
                floodit_cells[i][j].val(new_color);
                floodit_cells[i][j].css("backgroundColor", colors[new_color]);
                complete_cells++;
            }
        }
    }

    steps++;
    update_steps_counter();

    if (complete_cells == field_size * field_size) {
        setTimeout(function() {
            load_game_over_dialog();
        }, 100);
    }
    else {
        floodit_active = true;
    }
}

$(document).ready(function() {
    content = $("#content");
    set_event_listeners();
    load_main_dialog();
});