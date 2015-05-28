function AppHome() {
    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("home-header");
        _header.children().slice(0,1).addClass("home-header");
        _header.children().slice(1,2).addClass("home-header");
        $("#title").html("Welcome to Diversity!");
        $("title").html("Welcome to Diversity!");
    };

    this.init = function() {
        setTimeout(function() {
            $("#home-text-diversity").css("opacity", "1");

            setTimeout(function() {
                $("#home-description-text-various").css("opacity", "1");
                setTimeout(function() {
                    $("#home-description-text-unrelated").css("opacity", "1");
                    setTimeout(function() {
                        $("#home-description-text-apps").css("opacity", "1");
                        setTimeout(function() {
                            $("#home-tip").css("opacity", "1");
                        }, 1500);
                    }, 700);
                }, 700);
            }, 1000);
        }, 100);
    };

    this.transform = "translate(calc(-100vw), calc(-100vh))";
    this.html_path = "index.html";
}