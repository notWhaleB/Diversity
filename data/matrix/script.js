function AppMatrix() {
    this.fontSize = 14;
    this.letters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユ4" +
        "2ヨラリルレロワヰヱヲンㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄒㄓㄔㄕㄗㄘㄙㄚㄛㄜㄝㄞㄠㄡㄢㄣㄤㄥㄦㄨㄩㄪㄫㄬ";
    this.chrSetPow = this.letters.length;
    this.currentTim = undefined;

    this.mDropsCount = "mDropsCount"; this.mActive = "mActive"; this.mType = "mType"; this.mPauseValue = "mPauseValue";
    this.mCurrentPause = "mCurrentPause"; this.mGreen = "mGreen"; this.mWhite = "mWhite"; this.mSymbol = "mSymbol"; this.mFade = "mFade";

    this.matrixMap = [];
    this.canvas = undefined;
    this.context = undefined;
    this.mapW = 0; this.mapH = 0; this.onResize = true;

    this.timer = undefined;

    this.get_random_int = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.get_random_char = function() {
        var idx = this.get_random_int(0, this.chrSetPow - 1);
        return this.letters.slice(idx, idx + 1);
    };

    this.reset_matrix = function() {
        this.canvas.width = Math.max(800, parseInt(window.innerWidth / this.fontSize + 1) * this.fontSize - 10);
        this.canvas.height = Math.max(600, parseInt(window.innerHeight / this.fontSize + 1) * this.fontSize) - 30;
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;

        this.mapW = parseInt(this.canvasW / this.fontSize);
        this.mapH = parseInt(this.canvasH / this.fontSize);

        for (var i = 0; i <= this.mapW; ++i) {
            this.matrixMap[i] = [];
            this.matrixMap[i][this.mDropsCount] = 0;

            this.matrixMap[i][this.mActive] = false;
            for (var j = 0; j <= this.mapH; ++j) {
                this.matrixMap[i][j] = [];
                this.matrixMap[i][j][this.mType] = 0;
                this.matrixMap[i][j][this.mPauseValue] = 0;
                this.matrixMap[i][j][this.mCurrentPause] = 0;
                this.matrixMap[i][j][this.mGreen] = 0;
                this.matrixMap[i][j][this.mWhite] = 0;
                this.matrixMap[i][j][this.mSymbol] = '';
                this.matrixMap[i][j][this.mFade] = 0;
            }
        }
    };

    this.spawn_new_drop = function() {
        var randPosX = this.get_random_int(0, this.mapW);

        for (var i = 0; i != 10 && this.matrixMap[randPosX][this.mDropsCount] >= 2; ++i)
            randPosX = this.get_random_int(0, this.mapW);

        if (this.matrixMap[randPosX][this.mDropsCount] < 2) {
            this.matrixMap[randPosX][0][this.mType] = 1;
            this.matrixMap[randPosX][0][this.mPauseValue] = this.get_random_int(0, 2);
            this.matrixMap[randPosX][0][this.mCurrentPause] = this.matrixMap[randPosX][0][this.mPauseValue];
            this.matrixMap[randPosX][0][this.mWhite] = 250;
            this.matrixMap[randPosX][0][this.mGreen] = 0;
            this.matrixMap[randPosX][0][this.mSymbol] = this.get_random_char();
            this.matrixMap[randPosX][0][this.mFade] = this.get_random_int(5, 10);

            this.matrixMap[randPosX][this.mDropsCount]++;
            this.matrixMap[randPosX][this.mActive] = true;
        }
    };

    this.update = function() {
        for (var i = 0; i <= this.mapW; ++i) {
            if (this.matrixMap[i][this.mActive]) {
                var flag = false;
                for (var j = 0; j <= this.mapH; ++j) {
                    if (this.matrixMap[i][j][this.mType] != 0) {
                        flag = true;

                        if (this.matrixMap[i][j][this.mCurrentPause] > 0) {
                            this.matrixMap[i][j][this.mCurrentPause]--;
                            continue;
                        }
                        this.matrixMap[i][j][this.mCurrentPause] = this.matrixMap[i][j][this.mPauseValue];

                        switch (this.matrixMap[i][j][this.mType]) {
                            case 1: {
                                if (j < this.mapH) {
                                    for (var key in this.matrixMap[i][j]) {
                                        this.matrixMap[i][j + 1][key] = this.matrixMap[i][j][key];
                                    }
                                } else {
                                    this.matrixMap[i][this.mDropsCount]--;
                                }

                                this.matrixMap[i][j][this.mSymbol] = this.get_random_char();
                                this.matrixMap[i][j][this.mType] = 2;
                                this.matrixMap[i][j][this.mCurrentPause] = this.matrixMap[i][j][this.mPauseValue];
                                this.matrixMap[i][j][this.mWhite] = 200;
                                this.matrixMap[i][j][this.mGreen] = 0;

                                if (j < this.mapH) {
                                    j++;
                                }
                            } break;
                            case 2: {
                                if (this.get_random_int(1, 100) == 42)
                                    this.matrixMap[i][j][this.mSymbol] = this.get_random_char();

                                if (this.matrixMap[i][j][this.mWhite] > 150) {
                                    this.matrixMap[i][j][this.mWhite] -= 50;
                                    if (this.matrixMap[i][j][this.mWhite] <= 150) {
                                        this.matrixMap[i][j][this.mWhite] = 0;
                                        this.matrixMap[i][j][this.mGreen] = 250;
                                    }
                                } else if (this.matrixMap[i][j][this.mGreen] > 0) {
                                    this.matrixMap[i][j][this.mGreen] -= this.matrixMap[i][j][this.mFade];
                                    if (this.matrixMap[i][j][this.mGreen] <= 0) {
                                        this.matrixMap[i][j][this.mGreen] = 0;
                                        this.matrixMap[i][j][this.mType] = 0;
                                    }
                                }
                            } break;
                        }
                    }
                }
                if (!flag) {
                    this.matrixMap[i][this.mActive] = false;
                }
            }
        }

        if (this.get_random_int(1, 4) == 2) {
            this.spawn_new_drop();
        }
    };

    this.draw = function() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvasW, this.canvasH);
        this.context.font = "bold 14px sans-serif";

        for (var i = 0; i <= this.mapW; ++i) {
            if (this.matrixMap[i][this.mActive]) {
                for (var j = 0; j <= this.mapH; ++j) {
                    if (this.matrixMap[i][j][this.mType] != 0) {
                        this.context.fillStyle = "rgb(" + this.matrixMap[i][j][this.mWhite] + ", " +
                        Math.max(this.matrixMap[i][j][this.mGreen], this.matrixMap[i][j][this.mWhite]) + ", " + this.matrixMap[i][j][this.mWhite] + ")";
                        this.context.fillText(this.matrixMap[i][j][this.mSymbol], i * 16, 12 + j * 16);
                    }
                }
            }
        }
    };

    this.matrix = function() {
        clearInterval(this.timer);
        var start = this.currentTime.getMilliseconds();

        if (this.onResize) {
            this.onResize = false;
            this.reset_matrix();
        } else {
            this.update();
            this.draw();
        }

        this.timer = setInterval(function() {
            diversity.apps[DIVERSITY_APP_MATRIX].matrix();
        }, 25 - (this.currentTime.getMilliseconds() - start));
    };

    this.init = function() {
        this.canvas = document.querySelector("matrix-canvas");
        this.canvas = document.getElementById("matrix-canvas");
        this.context = this.canvas.getContext("2d");
        this.currentTime = new Date();

        addEventListener("resize", function(event) {
            diversity.apps[DIVERSITY_APP_MATRIX].onResize = true;
        });

        this.timer = setInterval(function() {
            diversity.apps[DIVERSITY_APP_MATRIX].matrix();
        }, 25);
    };

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("matrix-header");
        _header.children().slice(0,1).addClass("matrix-header");
        _header.children().slice(1,2).addClass("matrix-header");
        $("title").html("Matrix");
        $("#title").html("Matrix");
    };

    this.transform = "translate(-200vw, 0)";
    this.html_path = "matrix.html";
}
