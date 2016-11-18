window.Parsley
  .addValidator('name', {
      requirementType: 'string',
      validateString: function(value) {
          return value.split(/\S\s+\S/).length >= 2;
      },
      messages: {
          en: 'Please include first and last name.'
      }
  });

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

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
        var jsonData = this.$element.serializeObject();
        console.log(data);
        var button = $("button#submit-form");
        button.attr('disabled', 'disabled');
        button.text("SUBMITTING");

        $.post("/apply", data, function(done) {
            $("form#photographer-form input").attr('disabled', 'disabled');
            $("#photographer-form").hide();
            $("#awesome").fadeIn(300);
        
            analytics.track('Form Submitted', jsonData, {}, function(e) {
                console.log(e);
            });
        });
        return false;
    });

    $("#faq").on('click', function(e) {
        e.preventDefault();
        $("#faq-modal").modal();
    })
});