var DIVERSITY_APP_HOME = 0, DIVERSITY_APP_ESOTERIC = 1, DIVERSITY_APP_WORDSCHEAT = 2, DIVERSITY_APP_ABOUT = 3,
    DIVERSITY_APP_FOUR = 4, DIVERSITY_APP_TACTRIS = 5, DIVERSITY_APP_FLOODIT = 6, DIVERSITY_APP_BEEHIVE = 7,
    DIVERSITY_APP_EIGHT = 8;
var diversity;

$.fn.preload = function() {
    this.each(function() {
        (new Image()).src = this;
    });
};

function Diversity() {
    this.app_loaded = [];
    this.apps = [];
    this.map_opened = false;
    this.map_content = undefined;
    this.map_loaded = false;
    this.path = ["data/home/", "data/esoteric/", "data/wordscheat/", "data/about/", "", "data/tactris/", "data/floodit/", "data/beehive/"];
    this.classes = ["AppHome", "AppEsoteric", "AppWordscheat", "AppAbout", "", "AppTactris", "AppFloodit", "AppBeehive"];
    this.checker_interval = undefined;

    this.load_js = function(id) {
        var path = this.path[id] + "script.js";
        var loading = new $.Deferred();
        var self = this;

        var INTERVAL = 200;
        var check;

        var ref = document.createElement('script');
        ref.setAttribute("type","text/javascript");
        ref.setAttribute("src", path);

        if (typeof ref != "undefined") {
            document.head.appendChild(ref);
            check = setInterval(function () {
                if (typeof window[self.classes[id]] !== 'undefined') {
                    clearInterval(check);
                    loading.resolve();
                }
            }, INTERVAL)
        } else {
            loading.reject();
        }

        return loading.promise();
    };

    this.load_css = function(path) {
        var ref = document.createElement("link");
        ref.setAttribute("rel", "stylesheet");
        ref.setAttribute("type", "text/css");
        ref.setAttribute("href", path);
        if (typeof ref != "undefined")
            document.head.appendChild(ref);
    };

    this.clear_header = function() {
        var _tmp_jq = $("#header");
        _tmp_jq.removeClass();
        _tmp_jq.children().removeClass();
        _tmp_jq.addClass("header");
        _tmp_jq.children().slice(0,1).addClass("map-button");
        _tmp_jq.children().slice(1,2).addClass("title");
    };

    this.set_header = function(id) {
        this.clear_header();
        this.apps[id].set_header();
    };

    this.load_header = function() {
        return $.ajax({
            url: "data/header.html"
        }).done(function (data) {
            $("body").append(data);
        });
    };

    this.load_content = function(id) {
        $.ajax({
            url: diversity.path[id] + "content.html",
            success: function(data) {
                $("#map-cell-" + id.toString()).append(data);
                diversity.apps[id].init();
                //////////////////////////////
                $("body").css("opacity", "1");
                //////////////////////////////
            }
        });
    };

    this.load_app = function(id, animate) {
        if (!this.app_loaded[id]) {
            eval("this.apps[id] = new " + this.classes[id] + "();");

            this.load_content(id);
            this.app_loaded[id] = true;
        }
        if (animate) {
            this.map_content.css("transition", "all 1s ease");
            setTimeout(function () {
                diversity.map_content.css("transform", diversity.apps[id].transform);
                diversity.map_content.css("msTransform", diversity.apps[id].transform);
                diversity.map_content.css("oTransform", diversity.apps[id].transform);
                diversity.map_content.css("mozTransform", diversity.apps[id].transform);
                diversity.map_content.css("webkittransform", diversity.apps[id].transform);
                setTimeout(function () {
                    diversity.map_content.css("transition", "none");
                }, 1000);
            }, 0);
        } else {
            diversity.map_content.css("transform", diversity.apps[id].transform);
            diversity.map_content.css("msTransform", diversity.apps[id].transform);
            diversity.map_content.css("oTransform", diversity.apps[id].transform);
            diversity.map_content.css("mozTransform", diversity.apps[id].transform);
            diversity.map_content.css("webkittransform", diversity.apps[id].transform);
        }
        $(".map-panel-resume").remove();
        $(".map-panel-load").remove();
        $(".map-cell").css("border", "0");
        this.map_opened = false;
        this.set_header(id);
        window.history.pushState("", "", this.apps[id].html_path);
    };

    this.run_app = function(id, animate) {
        if (id == DIVERSITY_APP_FOUR || id == DIVERSITY_APP_EIGHT) {
            alert("Error: There is no assigned application.");
            return;
        }

        this.load_css(this.path[id] + "style.css");
        this.load_js(id)
            .then(function () {
                diversity.checker_interval = setInterval(function() {
                    if ($("link[href='" + diversity.path[id] + "style.css']").length != 0) {
                        clearInterval(diversity.checker_interval);
                        $("#map-cell-" + id).html("");
                        diversity.load_app(id, animate);
                    }
                }, 200);
            });
    };

    this.load_map = function(entry_point) {
        if (this.map_loaded) return;
        $.ajax({
            url: "data/map/content.html"
        }).done(function(data) {
            $("body").append(data);
            diversity.map_content = $("#map-content");

            for (var i = 0; i != 9; ++i) {
                diversity.app_loaded[i] = false;
            }
            diversity.map_loaded = true;
            diversity.load_header().then(function () {
                diversity.run_app(entry_point, false);
            });
        });
    };

    this.open_map = function() {
        if (this.map_opened) return;

        this.map_opened = true;
        this.clear_header();
        $("#title").html("Map");
        $("title").html("Map");
        $(".map-cell").css("border", "solid 3px #808080");

        for (var i = 0; i != 9; ++i) {
            if (this.app_loaded[i]) {
                $("#map-cell-" + i.toString()).append("<div class='map-panel-resume' onclick='diversity.load_app(" + i.toString() + ", true)'></div>");
            } else {
                $("#map-cell-" + i.toString()).append("<div class='map-panel-load' onclick='diversity.run_app(" + i.toString() + ", true)'></div>");
            }
        }
        this.map_content.css("transition", "all 1s ease");
        setTimeout(function() {
            diversity.map_content.css("transform", "translate(-100vw, -100vh) scale(0.3, 0.3)");
            setTimeout(function() {
                diversity.map_content.css("transition", "none");
            }, 1000);
        }, 0);
    };
}
