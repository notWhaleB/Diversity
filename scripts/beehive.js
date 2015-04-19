var UP_LEFT = 0, UP_RIGHT = 1, RIGHT = 2, DOWN_RIGHT = 3, DOWN_LEFT = 4, LEFT = 5;
var END_COORD = [], DELTA_COORD = [];
END_COORD[UP_LEFT] = [2, 11, 20, 40, 60];
END_COORD[UP_RIGHT] = [20, 40, 60, 71, 82];
END_COORD[RIGHT] = [60, 71, 82, 73, 64];
END_COORD[DOWN_RIGHT] = [82, 73, 64, 44, 24];
END_COORD[DOWN_LEFT] = [64, 44, 24, 13, 2];
END_COORD[LEFT] = [24, 13, 2, 11, 20];
DELTA_COORD[UP_LEFT] = -11;
DELTA_COORD[UP_RIGHT] = 9;
DELTA_COORD[RIGHT] = 20;
DELTA_COORD[DOWN_RIGHT] = 11;
DELTA_COORD[DOWN_LEFT] = -9;
DELTA_COORD[LEFT] = -20;

var field = [];
var cells = [];
var blocks = [];
var blocks_DOM = [];
var removed_blocks = [];
var ready = false;

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function set_event_listeners() {
    addEventListener("keypress", function(event) {
        if (ready) {
            switch (event.keyCode) {
                case 119: move_blocks(0); break;
                case 101: move_blocks(1); break;
                case 100: move_blocks(2); break;
                case 120: move_blocks(3); break;
                case 122: move_blocks(4); break;
                case 97: move_blocks(5); break;
            }
        }
    });
}

function set_cells_positions() {
    var cell, cell_border;

    for (var j = 0; j != 5; ++j) {
        for (var i = 0; i != 9; ++i) {
            var cur_id = i * 10 + j;
            field[cur_id] = -1;
            cell = $("#cell_" + cur_id.toString());

            if (cell.val() == undefined) continue;

            field[cur_id] = 0;
            cells[cur_id] = cell;
            cell_border = $("#border_" + i.toString() + j.toString());
            cell.css("left", ((i - 2) * 46 + 6 + 230).toString() + "px");
            cell.css("top", (50 + 74 * j).toString() + "px");
            cell_border.css("left", ((i - 2) * 46 + 230).toString() + "px");
            cell_border.css("top", (50 + 74 * j - 5).toString() + "px");
        }
    }

    blocks.push(undefined);
    blocks_DOM.push(undefined);
}

function move_blocks(direction) {
    var counter_direction = (direction + 3) % 6;
    for (var i = 0; i != 5; ++i) {
        var begin_coord = END_COORD[counter_direction][4 - i] - DELTA_COORD[direction];
        for (var j = END_COORD[direction][i]; j != begin_coord; j -= DELTA_COORD[direction]) {
            for (var k = j - DELTA_COORD[direction]; k != begin_coord; k -= DELTA_COORD[direction]) {
                if (field[k] > 0) {
                    if (blocks[field[j]] == blocks[field[k]]) {
                        blocks_DOM[field[j]].remove();
                        field[j] = field[k];
                        blocks_DOM[field[k]].removeClass("block-value-" + blocks[field[k]]);
                        blocks[field[k]]++;
                        blocks_DOM[field[k]].addClass("block-value-" + blocks[field[k]]);
                        field[k] = 0;
                    } else if (field[j] == 0) {
                        field[j] = field[k];
                        j += DELTA_COORD[direction];
                        field[k] = 0;
                    }
                    break;
                }
            }
        }
    }

    var changed = false;
    for (var j = 0; j != 5; ++j) {
        for (var i = 0; i != 9; ++i) {
            var cur_id = i * 10 + j;
            if (field[cur_id] > 0) {
                if (blocks_DOM[field[cur_id]].css("left") != cells[cur_id].css("left") ||
                    blocks_DOM[field[cur_id]].css("top") != cells[cur_id].css("top")) {
                    blocks_DOM[field[cur_id]].css("left", cells[cur_id].css("left"));
                    blocks_DOM[field[cur_id]].css("top", cells[cur_id].css("top"));
                    changed = true;
                }
            }
        }
    }

    if (changed) {
        ready = false;
        setTimeout(function () {
            add_new_block();
            add_new_block();
            ready = true;
        }, 600);
    }
}

function add_new_block() {
    var free_cells = [];
    for (var j = 0; j != 5; ++j) {
        for (var i = 0; i != 9; ++i) {
            var cur_id = i * 10 + j;
            if (field[cur_id] == 0) {
                free_cells.push(cur_id);
            }
        }
    }

    if (free_cells.length == 0) {
        alert("Game over.");
    }

    var pos_idx = get_random_int(0, free_cells.length - 1);

    if (removed_blocks.length == 0) {
        field[free_cells[pos_idx]] = blocks.length;
        $("#gamefield").append("<div id='block_" + blocks.length + "' class='block block-value-1' style='left: " +
        cells[free_cells[pos_idx]].css("left") + ";top: " +
        cells[free_cells[pos_idx]].css("top") + ";'></div>");
        blocks.push(1);
        blocks_DOM.push($("#block_" + (blocks.length - 1).toString()));
    } else {
        field[free_cells[pos_idx]] = removed_blocks[0];
        $("#gamefield").append("<div id='block_" + removed_blocks[0] + "' class='block block-value-1' style='left: " +
        cells[free_cells[pos_idx]].css("left") + ";top: " +
        cells[free_cells[pos_idx]].css("top") + ";'></div>");
        blocks[removed_blocks[0]] = 1;
        blocks_DOM[removed_blocks[0]] = $("#block_" + removed_blocks[0]);
        removed_blocks.shift();
    }
}

$(document).ready(function() {
    setTimeout(function() {
        set_cells_positions();
    }, 100);

    setTimeout(function() {
        add_new_block();
        add_new_block();
    }, 600);

    set_event_listeners();

    ready = true;
});
