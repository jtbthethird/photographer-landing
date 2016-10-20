$(function() {
    $("#example-link").on("click", function(e) {
        e.preventDefault();
        var photosSide = $("#photos-side");
        photosSide.removeClass("hidden-xs");
    });
    
    $("#apply-link").on("click", function(e) {
        e.preventDefault();
        var photosSide = $("#photos-side");
        photosSide.addClass("hidden-xs");
    });
})