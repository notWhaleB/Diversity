$(document).ready(function() {

});

function foo() {
    var string = $("#wordscheat-input").val();
    $.getJSON("http://serv.begishev.me", string)
        .done(function(json) {
            var result_html = "";
            for (var i = 0; i != json.data.length; ++i) {
               result_html += json.data[i] + "<br>";
            }
            $("#wordscheat-results").html(result_html);
        });
}
