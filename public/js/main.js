$(function() {
    $("#example-link").on("click", function(e) {
        e.preventDefault();
        var photosSide = $("#photos-side");
        var width = $("body").width();
        photosSide.css("right", -width);
        photosSide.removeClass("hidden-xs");
        photosSide.animate({"right": 0}, 300, "swing");
        
    });
    
    $("#apply-link").on("click", function(e) {
        e.preventDefault();
        var photosSide = $("#photos-side");
        var width = $("body").width();
        photosSide.animate({"right": -width}, 300, "swing", function() {
            photosSide.addClass("hidden-xs");    
        });
    });
    
    var submitForm = function(e) {
        console.log("Processing");
        e.preventDefault();
        console.log(e);
        $.post("/apply", e);
        return true;
    };
    
    $("#photographer-form").parsley({ });
    
    $('#photographer-form').parsley().on('form:submit', function() {
        var data = this.$element.serialize();
        console.log(data);
        var button = $("button#submit-form");
        button.attr('disabled', 'disabled');
        button.text("SUBMITTING");
        
        $.post("/apply", data, function(done) {
            $("form#photographer-form input").attr('disabled', 'disabled');
            button.text("THANKS!");
        });
        return false;
    });

});