function AppWordscheat() {
    this.get_results = function() {
        var string = $("#wordscheat-input").val();
        $.getJSON("http://serv.begishev.me", string)
            .done(function(json) {
                var result_html = "";
                for (var i = 0; i != json.data.length; ++i) {
                    result_html += json.data[i] + "<br>";
                }
                $("#wordscheat-results").html(result_html);
            });
    };

    this.init = function() {};

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("wordscheat-header");
        _header.children().slice(0,1).addClass("wordscheat-header");
        _header.children().slice(1,2).addClass("wordscheat-header");
        $("#title").html("Wordscheat");
        $("title").html("Wordscheat");
    };

    this.transform = "translate(-200vw, -200vh)";
    this.html_path = "wordscheat.html";
}