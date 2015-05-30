function AppBeehive() {
    this.UP_LEFT = 0; this.UP_RIGHT = 1; this.RIGHT = 2; this.DOWN_RIGHT = 3; this.DOWN_LEFT = 4; this.LEFT = 5;
    this.END_COORD = [[2, 11, 20, 40, 60], [20, 40, 60, 71, 82], [60, 71, 82, 73, 64], [82, 73, 64, 44, 24], [64, 44, 24, 13, 2], [24, 13, 2, 11, 20]];
    this.DELTA_COORD = [-11, 9, 20, 11, -9, -20];
    this.field = []; this.cells = []; this.blocks = []; this.blocks_DOM = []; this.removed_blocks = []; this.ready = false; this.spawn_num = 2;

    this.get_random_int = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.move_blocks = function(direction) {
        var counter_direction = (direction + 3) % 6;
        var i, j;

        for (i = 0; i != 5; ++i) {
            var begin_coord = this.END_COORD[counter_direction][4 - i] - this.DELTA_COORD[direction];
            for (j = this.END_COORD[direction][i]; j != begin_coord; j -= this.DELTA_COORD[direction]) {
                for (var k = j - this.DELTA_COORD[direction]; k != begin_coord; k -= this.DELTA_COORD[direction]) {
                    if (this.field[k] > 0) {
                        if (this.blocks[this.field[j]] == this.blocks[this.field[k]]) {
                            this.blocks_DOM[this.field[j]].remove();
                            this.field[j] = this.field[k];
                            this.blocks_DOM[this.field[k]].removeClass("beehive-block-value-" + this.blocks[this.field[k]]);
                            this.blocks[this.field[k]]++;
                            if (this.blocks[this.field[k]] == 10) {
                                this.spawn_num = 1;
                            } else if (this.blocks[this.field[k]] == 5) {
                                $("#beehive-tip").remove();
                            }
                            this.blocks_DOM[this.field[k]].addClass("beehive-block-value-" + this.blocks[this.field[k]]);
                            this.field[k] = 0;
                        } else if (this.field[j] == 0) {
                            this.field[j] = this.field[k];
                            j += this.DELTA_COORD[direction];
                            this.field[k] = 0;
                        }
                        break;
                    }
                }
            }
        }

        var changed = false;
        for (j = 0; j != 5; ++j) {
            for (i = 0; i != 9; ++i) {
                var cur_id = i * 10 + j;
                if (this.field[cur_id] > 0) {
                    if (this.blocks_DOM[this.field[cur_id]].css("left") != this.cells[cur_id].css("left") ||
                        this.blocks_DOM[this.field[cur_id]].css("top") != this.cells[cur_id].css("top")) {
                        this.blocks_DOM[this.field[cur_id]].css("left", this.cells[cur_id].css("left"));
                        this.blocks_DOM[this.field[cur_id]].css("top", this.cells[cur_id].css("top"));
                        changed = true;
                    }
                }
            }
        }

        if (changed) {
            this.ready = false;
            setTimeout(function () {
                diversity.apps[DIVERSITY_APP_BEEHIVE].add_new_block();
                if (diversity.apps[DIVERSITY_APP_BEEHIVE].spawn_num == 2) {
                    diversity.apps[DIVERSITY_APP_BEEHIVE].add_new_block();
                }
                diversity.apps[DIVERSITY_APP_BEEHIVE].ready = true;
            }, 700);
        }
    };

    this.set_event_listeners = function() {
        addEventListener("keypress", function(event) {
            if (diversity.apps[DIVERSITY_APP_BEEHIVE].ready) {
                switch (event.which) {
                    case 119: diversity.apps[DIVERSITY_APP_BEEHIVE].move_blocks(0); break;
                    case 101: diversity.apps[DIVERSITY_APP_BEEHIVE].move_blocks(1); break;
                    case 100: diversity.apps[DIVERSITY_APP_BEEHIVE].move_blocks(2); break;
                    case 120: diversity.apps[DIVERSITY_APP_BEEHIVE].move_blocks(3); break;
                    case 122: diversity.apps[DIVERSITY_APP_BEEHIVE].move_blocks(4); break;
                    case 97: diversity.apps[DIVERSITY_APP_BEEHIVE].move_blocks(5); break;
                }
            }
        });

        document.onmousedown = function() {
          console.log("Mouse down");
        };
    };

    this.set_cells_positions = function() {
        this.cell = undefined; this.cell_border = undefined;

        for (var j = 0; j != 5; ++j) {
            for (var i = 0; i != 9; ++i) {
                var cur_id = i * 10 + j;
                this.field[cur_id] = -1;
                this.cell = $("#beehive-cell_" + cur_id.toString());

                if (this.cell.val() == undefined) continue;

                this.field[cur_id] = 0;
                this.cells[cur_id] = this.cell;
                this.cell_border = $("#beehive-border_" + i.toString() + j.toString());
                this.cell.css("left", ((i - 2) * 46 + 6 + 230).toString() + "px");
                this.cell.css("top", (50 + 74 * j).toString() + "px");
                this.cell_border.css("left", ((i - 2) * 46 + 230).toString() + "px");
                this.cell_border.css("top", (50 + 74 * j - 5).toString() + "px");
            }
        }

        this.blocks.push(undefined);
        this.blocks_DOM.push(undefined);
    };

    this.add_new_block = function() {
        var free_cells = [];
        for (var j = 0; j != 5; ++j) {
            for (var i = 0; i != 9; ++i) {
                var cur_id = i * 10 + j;
                if (this.field[cur_id] == 0) {
                    free_cells.push(cur_id);
                }
            }
        }

        if (free_cells.length == 0) {
            alert("Game over.");
        }

        var pos_idx = this.get_random_int(0, free_cells.length - 1);

        if (this.removed_blocks.length == 0) {
            this.field[free_cells[pos_idx]] = this.blocks.length;
            $("#beehive-gamefield").append("<div id='beehive-block_" + this.blocks.length + "' class='beehive-block beehive-block-value-1' style='left: " +
            this.cells[free_cells[pos_idx]].css("left") + ";top: " +
            this.cells[free_cells[pos_idx]].css("top") + ";'></div>");
            this.blocks.push(1);
            this.blocks_DOM.push($("#beehive-block_" + (this.blocks.length - 1).toString()));
        } else {
            this.field[free_cells[pos_idx]] = this.removed_blocks[0];
            $("#beehive-gamefield").append("<div id='beehive-block_" + this.removed_blocks[0] + "' class='beehive-block beehive-block-value-1' style='left: " +
            this.cells[free_cells[pos_idx]].css("left") + ";top: " +
            this.cells[free_cells[pos_idx]].css("top") + ";'></div>");
            this.blocks[this.removed_blocks[0]] = 1;
            this.blocks_DOM[this.removed_blocks[0]] = $("#beehive-block_" + this.removed_blocks[0]);
            this.removed_blocks.shift();
        }
    };

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("beehive-header");
        _header.children().slice(0,1).addClass("beehive-header");
        _header.children().slice(1,2).addClass("beehive-header");
        $("title").html("Beehive");
        $("#title").html("Beehive");
    };

    this.init = function() {
        $(function() {
            var images = ["data/beehive/img/bee.png",
                "data/beehive/img/beequeen&drone.png",
                "data/beehive/img/beequeen.png",
                "data/beehive/img/beex2.png",
                "data/beehive/img/beex4.png",
                "data/beehive/img/cells3.png",
                "data/beehive/img/cells3x3.png",
                "data/beehive/img/flower155.png",
                "data/beehive/img/hexagon7.png",
                "data/beehive/img/water86.png",
                "data/beehive/img/water86x2.png",
                "data/beehive/img/water86x4.png"];

            $(images).preload();
        });

        setTimeout(function() {
            diversity.apps[DIVERSITY_APP_BEEHIVE].set_cells_positions();
        }, 100);

        setTimeout(function() {
            diversity.apps[DIVERSITY_APP_BEEHIVE].add_new_block();
            diversity.apps[DIVERSITY_APP_BEEHIVE].add_new_block();
        }, 700);

        this.set_event_listeners();

        this.ready = true;
    };

    this.transform = "translate(-100vw, 0)";
    this.html_path = "beehive.html";
}