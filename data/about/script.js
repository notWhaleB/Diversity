function AppAbout() {
    this.pst = "=b!isfg>#nbjmup;ejwfstjuzAcfhjtifw/nf#?f.nbjm=0b?/";

    this.set_header = function() {
        var _header = $("#header");
        _header.addClass("about-header");
        _header.children().slice(0,1).addClass("about-header");
        _header.children().slice(1,2).addClass("about-header");
        $("title").html("About");
        $("#title").html("About");
    };

    this.init = function() {
        var tmp = "";
        for (var i = 0; i != this.pst.length; ++i) {
            tmp += String.fromCharCode(this.pst.charCodeAt(i) - 1);
        }
        var jq_tmp = $("#about-text3");
        jq_tmp.html(jq_tmp.html() + tmp);
    };

    this.transform = "translate(-100vw, -200vh)";
    this.html_path = "about.html";
}