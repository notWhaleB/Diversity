function AppTactris() {
    this.cells = []; this.cell_hover_calls = []; this.cell_leave_calls = []; this.cell_select_calls = [];
    this.cell_remove_calls = []; this.mouse_pressed = false; this.button = undefined; this.selected_cells_remover = undefined;
    this.occupied_cells_remover_interval = undefined; this.score_panel = undefined;

    this.current_shapeform_id = 0; this.next_shapeform_id = 0; this.shapeforms = [];
    this.shapeforms_delta = [];  //Start point (0, 0) is extreme upper left box point.
    this.cells_states = []; this.next_preview = []; this.current_preview = [];

    this.get_random_int = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.occupied_cells_remover = function() {
        if (this.cell_remove_calls.length != 0) {
            this.cells_states[this.cell_remove_calls[0]] = 0;
            this.cells[this.cell_remove_calls[0]].removeClass("tactris-cell-occupied");
            this.cell_remove_calls.shift();
            this.score_panel.html(parseInt(this.score_panel.html()) + 1);
        }
        else {
            clearInterval(this.occupied_cells_remover_interval);
        }
    };

    this.field_processor = function() {
        var vertical_flag, horizontal_flag;
        var i, j;

        for (i = 0; i != 10; ++i) {
            vertical_flag = true;
            horizontal_flag = true;
            for (j = 0; j != 10; ++j) {
                if (this.cells_states[i * 10 + j] != 1) vertical_flag = false;
                if (this.cells_states[j * 10 + i] != 1) horizontal_flag = false;
            }
            if (vertical_flag) {
                for (j = 0; j != 10; ++j) {
                    this.cell_remove_calls.push(i * 10 + j);
                }
            }
            if (horizontal_flag) {
                for (j = 0; j != 10; ++j) {
                    this.cell_remove_calls.push(j * 10 + i);
                }
            }
        }

        this.score_panel = $('#tactris-score-panel');

        this.occupied_cells_remover_interval = setInterval(function() {
            diversity.apps[DIVERSITY_APP_TACTRIS].occupied_cells_remover();
        }, 20);
    };

    this.init_fields = function() {
        var i, j, cur_id;

        for (i = 0; i != 10; ++i) {
            for (j = 0; j != 10; ++j) {
                this.cells_states[i * 10 + j] = 0;
                cur_id = i * 10 + j;
                this.cells[cur_id] = $("#tactris-cell_" + i + j);
                this.cells[cur_id].addClass("tactris-cell-free");
                this.cells[cur_id].addClass("tactris-fast-transition");
            }
        }

        for (i = 0; i != 4; ++i) {
            for (j = 0; j != 4; ++j) {
                cur_id = i * 10 + j;
                this.current_preview[cur_id] = $("#tactris-cur-pre-cell_" + i + j);
                this.current_preview[cur_id].addClass("tactris-cur-preview-cell-disabled");
                this.next_preview[cur_id] = $("#tactris-next-pre-cell_" + i + j);
                this.next_preview[cur_id].addClass("tactris-next-preview-cell-disabled");
            }
        }

        this.current_shapeform_id = this.get_random_int(0, 18);
        this.next_shapeform_id = this.get_random_int(0, 18);
    };

    this.set_event_listeners = function() {
        addEventListener("mousedown", function(event) {
            if (event.which == 1) {
                diversity.apps[DIVERSITY_APP_TACTRIS].mouse_pressed = true;
                if (diversity.apps[DIVERSITY_APP_TACTRIS].selected_cells_remover) {
                    clearTimeout(diversity.apps[DIVERSITY_APP_TACTRIS].selected_cells_remover);
                }
            }
        });

        addEventListener("mouseup", function(event) {
            if (event.which == 1) {
                var _app = diversity.apps[DIVERSITY_APP_TACTRIS];
                _app.mouse_pressed = false;
                var match_with_current = false, i;


                if (_app.cell_select_calls.length == 4) {
                    match_with_current = true;
                    var temp = _app.cell_select_calls.slice();
                    var min_x = 100, min_y = 100;

                    for (i = 0; i != 4; ++i) {
                        min_x = Math.min(temp[i] % 10, min_x);
                        min_y = Math.min(Math.floor(temp[i] / 10), min_y);
                    }
                    for (i = 0; i != 4; ++i) {
                        temp[i] = [Math.floor(temp[i] / 10) - min_y, temp[i] % 10 - min_x];
                    }
                    temp.sort();

                    for (i = 0; i != 4; ++i) {
                        if (temp[i][0] != _app.shapeforms_delta[_app.current_shapeform_id][i][0] ||
                            temp[i][1] != _app.shapeforms_delta[_app.current_shapeform_id][i][1]) {
                            match_with_current = false;
                        }
                    }
                }

                if (match_with_current) {
                    for (i = 0; i != 4; ++i) {
                        _app.cells[_app.cell_select_calls[i]].removeClass("tactris-cell-selected");
                        _app.cells[_app.cell_select_calls[i]].addClass("tactris-cell-occupied");
                        _app.cells_states[_app.cell_select_calls[i]] = 1;
                    }

                    _app.current_shapeform_id = _app.next_shapeform_id;
                    _app.next_shapeform_id = _app.get_random_int(0, 16);
                    _app.set_current_preview();
                    _app.field_processor();
                } else {
                    _app.selected_cells_remover = setInterval(function() {
                        if (_app.cell_select_calls.length != 0) {
                            _app.cells[_app.cell_select_calls[0]].removeClass("tactris-cell-selected");
                            _app.cell_select_calls.shift();
                        } else {
                            clearTimeout(_app.selected_cells_remover);
                        }
                    }, 500);
                }
            }
        });
    };

    this.load_shapeforms = function() {
        var i, j, p, q;

        $.ajax({
            url: "data/tactris/shapeforms",
            success: function(data) {
                for (i = 0, j = 0; i != 19; ++i) {
                    var buff_0 = []; var delta = [];
                    for (p = 0; p != 4; ++p) {
                        var buff_1 = [];
                        for (q = 0; q != 4; ++q, ++j) {
                            var value = parseInt(data.charAt(j), 10);
                            if (value == 1) {
                                delta.push([q, p]);
                            }
                            buff_1.push(value);
                        }
                        ++j;
                        buff_0.push(buff_1);
                    }
                    diversity.apps[DIVERSITY_APP_TACTRIS].shapeforms.push(buff_0);

                    var min_x = 100, min_y = 100;
                    for (p = 0; p != 4; ++p) {
                        min_x = Math.min(delta[p][0], min_x);
                        min_y = Math.min(delta[p][1], min_y);
                    }
                    for (p = 0; p != 4; ++p) {
                        delta[p][0] -= min_x;
                        delta[p][1] -= min_y;
                    }
                    delta.sort();
                    diversity.apps[DIVERSITY_APP_TACTRIS].shapeforms_delta.push(delta);
                }
                diversity.apps[DIVERSITY_APP_TACTRIS].set_current_preview();
            }
        });
    };

    this.set_current_preview = function() {
        for (var i = 0; i != 4; ++i) {
            for (var j = 0; j != 4; ++j) {
                var cur_id = i * 10 + j;
                if (this.shapeforms[this.current_shapeform_id][j][i] == 1) {
                    this.current_preview[cur_id].removeClass("tactris-cur-preview-cell-disabled");
                    this.current_preview[cur_id].addClass("tactris-cur-preview-cell-enabled");
                } else {
                    this.current_preview[cur_id].addClass("tactris-cur-preview-cell-disabled");
                    this.current_preview[cur_id].removeClass("tactris-cur-preview-cell-enabled");
                }
                if (this.shapeforms[this.next_shapeform_id][j][i] == 1) {
                    this.next_preview[cur_id].removeClass("tactris-next-preview-cell-disabled");
                    this.next_preview[cur_id].addClass("tactris-next-preview-cell-enabled");
                } else {
                    this.next_preview[cur_id].addClass("tactris-next-preview-cell-disabled");
                    this.next_preview[cur_id].removeClass("tactris-next-preview-cell-enabled");
                }
            }
        }
    };

    this.cell_selected = function(id) {
        var cur_id = parseInt(id, 10);

        if (!this.cells[cur_id].hasClass("tactris-cell-selected") && this.cells_states[cur_id] == 0) {
            this.cells[cur_id].addClass("tactris-cell-selected");
            this.cells[cur_id].removeClass("ftactris-ast-transition");
            this.cells[cur_id].addClass("tactris-slow-transition");
            this.cell_select_calls.push(cur_id);
        }

        if (this.cell_select_calls.length > 4) {
            this.cells[this.cell_select_calls[0]].removeClass("tactris-cell-selected");
            setTimeout(function() {
                var _app = diversity.apps[DIVERSITY_APP_TACTRIS];
                _app.cells[_app.cell_select_calls[0]].removeClass("tactris-fast-transition");
                _app.cells[_app.cell_select_calls[0]].addClass("tactris-slow-transition");
                _app.cell_select_calls.shift();
            }, 1);
        }
    };

    this.cell_hover = function(id) {
        var cur_id = parseInt(id, 10);
        this.cells[cur_id].addClass("tactris-cell-free-hover");

        if (!this.cells[cur_id].hasClass("tactris-cell-selected")) {
            if (this.mouse_pressed) {
                this.cell_selected(cur_id)
            } else {
                this.cell_hover_calls.push(cur_id);
                setTimeout(function () {
                    var _app = diversity.apps[DIVERSITY_APP_TACTRIS];
                    _app.cells[_app.cell_hover_calls[0]].removeClass("tactris-fast-transition");
                    _app.cells[_app.cell_hover_calls[0]].addClass("tactris-slow-transition");
                    _app.cell_hover_calls.shift();
                }, 3);
            }
        }
    };

    this.cell_leave = function(id) {
        var cur_id = parseInt(id, 10);
        this.cells[cur_id].removeClass("tactris-cell-free-hover");

        if (!this.cells[cur_id].hasClass("tactris-cell-selected")) {
            this.cell_leave_calls.push(cur_id);
            setTimeout(function () {
                var _app = diversity.apps[DIVERSITY_APP_TACTRIS];
                _app.cells[_app.cell_leave_calls[0]].removeClass("tactris-slow-transition");
                _app.cells[_app.cell_leave_calls[0]].addClass("tactris-fast-transition");
                _app.cell_leave_calls.shift();
            }, 3);
        }
    };

    //this.cell_pressed = function(id) {
    //    setTimeout(function () {
    //        if (diversity.apps[DIVERSITY_APP_TACTRIS].mouse_pressed) diversity.apps[DIVERSITY_APP_TACTRIS].cell_selected(id);
    //    }, 10);
    //};

    this.init = function() {
        this.init_fields();
        this.set_event_listeners();
        this.load_shapeforms();
    };

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("tactris-header");
        _header.children().slice(0,1).addClass("tactris-header");
        _header.children().slice(1,2).addClass("tactris-header");
        $("#title").html("Tactris");
        $("title").html("Tactris");
    };

    this.transform = "translate(0, -100vh)";
    this.html_path = "tactris.html";
}