function AppFloodit() {
    this.content = undefined; this.floodit_cells = []; this.field_size = 0; this.steps = 0;
    this.steps_limit = 0; this.floodit_active = false; this.colors = ["#2ecc71", "#3498db", "#9b59b6", "#e74c3c", "#f1c40f", "#ecf0f1"];

    this.get_random_int = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.set_event_listeners = function() {
        addEventListener("keypress", function(event) {
            if (diversity.apps[DIVERSITY_APP_FLOODIT].floodit_active) {
                switch (event.which) {
                    case 49: diversity.apps[DIVERSITY_APP_FLOODIT].turn_color_to(0); break;
                    case 50: diversity.apps[DIVERSITY_APP_FLOODIT].turn_color_to(1); break;
                    case 51: diversity.apps[DIVERSITY_APP_FLOODIT].turn_color_to(2); break;
                    case 52: diversity.apps[DIVERSITY_APP_FLOODIT].turn_color_to(3); break;
                    case 53: diversity.apps[DIVERSITY_APP_FLOODIT].turn_color_to(4); break;
                    case 54: diversity.apps[DIVERSITY_APP_FLOODIT].turn_color_to(5); break;
                }
            }
        });
    };

    this.update_steps_counter = function() {
        $("#floodit-steps-counter").html("Steps: " + this.steps.toString() + "/" + this.steps_limit);
    };

    this.load_main_dialog = function() {
        $.ajax({
            url: "data/floodit/floodit-main-dialog.html",
            success: function(data) {
                diversity.apps[DIVERSITY_APP_FLOODIT].content.children().first().remove();
                diversity.apps[DIVERSITY_APP_FLOODIT].content.append(data);
            }
        });
    };

    this.load_configure_new_game_dialog = function() {
        $.ajax({
            url: "data/floodit/floodit-configure-new-game-dialog.html",
            success: function(data) {
                diversity.apps[DIVERSITY_APP_FLOODIT].content.children().remove();
                diversity.apps[DIVERSITY_APP_FLOODIT].content.append(data);
            }
        });
    };

    this.load_game = function() {
        var _app = diversity.apps[DIVERSITY_APP_FLOODIT];
        $.ajax({
            url: "data/floodit/floodit-game.html",
            success: function(data) {
                _app.floodit_cells = [];
                _app.field_size = parseInt($("#floodit-size-selector").val());
                _app.steps = 0;
                _app.steps_limit = Math.floor(_app.field_size * 1.7);

                _app.content.children().first().remove();
                _app.content.append(data);

                var field_html = "", i, j;
                for (i = 0; i != _app.field_size; ++i) {
                    field_html = "";
                    field_html += "<tr>\n";
                    for (j = 0; j != _app.field_size; ++j) {
                        field_html += '<td class="floodit-cell" id="floodit-cell_' + j.toString() + "_" + i.toString() + '"></td>';
                    }
                    field_html += "</tr>\n";
                    $("#floodit-gamefield").append(field_html);
                }
                var floodit_cell_class = $(".floodit-cell");
                floodit_cell_class.css("width", (480 / _app.field_size).toString() + "px");
                floodit_cell_class.css("height", (480 / _app.field_size).toString() + "px");

                for (i = 0; i != _app.field_size; ++i) {
                    _app.floodit_cells.push([]);
                    for (j = 0; j != _app.field_size; ++j) {
                        _app.floodit_cells[i].push($("#floodit-cell_" + i.toString() + "_" + j.toString()));
                    }
                }

                for (i = 0; i != _app.field_size; ++i) {
                    for (j = 0; j != _app.field_size; ++j) {
                        _app.floodit_cells[i][j].val(_app.get_random_int(0, 5));
                        _app.floodit_cells[i][j].css("backgroundColor", _app.colors[_app.floodit_cells[i][j].val()]);
                    }
                }

                _app.update_steps_counter();
                _app.floodit_active = true;
            }
        });
    };

    this.load_game_over_dialog = function() {
        var _app = diversity.apps[DIVERSITY_APP_FLOODIT];
        _app.floodit_active = false;
        $.ajax({
            url: "data/floodit/floodit-game-over.html",
            success: function(data) {
                _app.content.append(data);

                setTimeout(function() {
                    $("#floodit-game-over-content").addClass("floodit-game-over-content-focus");
                    $("#floodit-game-over-wrapper").addClass("floodit-game-over-wrapper-focus");
                    $("#floodit-game-over-dialog-text").html("You've done in " + _app.steps.toString() +
                    " of " + _app.steps_limit.toString() + " steps.");
                }, 100);
            }
        });
    };

    this.reload_game = function() {
        $("#floodit-game-over-content").removeClass("floodit-game-over-content-focus");
        $("#floodit-game-over-wrapper").removeClass("floodit-game-over-wrapper-focus");

        setTimeout(function() {
            diversity.apps[DIVERSITY_APP_FLOODIT].load_configure_new_game_dialog();
        }, 500);
    };

    this.turn_color_to = function(new_color) {
        this.floodit_active = false;
        var old_color = this.floodit_cells[0][0].val();
        if (old_color == new_color) return;

        var traversal_queue = [];
        traversal_queue.push([0, 0]);
        this.floodit_cells[0][0].val(-1);
        var shift_x = [0, 0, -1, 1];
        var shift_y = [-1, 1, 0, 0];

        while (traversal_queue.length != 0) {
            var current = traversal_queue[0];
            var cur_x = current[0], cur_y = current[1];
            traversal_queue.shift();
            for (var p = 0; p != 4; ++p) {
                var next_x = cur_x + shift_x[p], next_y = cur_y + shift_y[p];
                if (0 <= next_x && next_x < this.field_size &&
                    0 <= next_y && next_y < this.field_size &&
                    this.floodit_cells[next_x][next_y].val() == old_color) {
                    traversal_queue.push([next_x, next_y]);
                    this.floodit_cells[next_x][next_y].val(-1);
                }
            }
        }

        var complete_cells = 0;
        for (var i = 0; i != this.field_size; ++i) {
            for (var j = 0; j != this.field_size; ++j) {
                if (this.floodit_cells[i][j].val() == new_color) {
                    complete_cells++;
                }
                if (this.floodit_cells[i][j].val() == -1) {
                    this.floodit_cells[i][j].val(new_color);
                    this.floodit_cells[i][j].css("backgroundColor", this.colors[new_color]);
                    complete_cells++;
                }
            }
        }

        this.steps++;
        this.update_steps_counter();

        if (complete_cells == this.field_size * this.field_size) {
            setTimeout(function() {
                diversity.apps[DIVERSITY_APP_FLOODIT].load_game_over_dialog();
            }, 100);
        }
        else {
            this.floodit_active = true;
        }
    };

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("floodit-header");
        _header.children().slice(0,1).addClass("floodit-header");
        _header.children().slice(1,2).addClass("floodit-header");
        $("#title").html("Flood it");
        $("title").html("Flood it");
    };

    this.init = function() {
        this.content = $("#floodit-content");
        this.set_event_listeners();
        this.load_main_dialog();
    };

    this.transform = "translate(0, 0)";
    this.html_path = "floodit.html";
}