$(function() {
    $('#successMsgID, #errorMsgID').delay(4000).fadeOut();

});

function sendRequest(formId,errorObj, urlParam, formData){

    $("#divHeaderMsg").attr("class", "");
    $("#divHeaderMsg").text("");
    $('.error_fields').removeClass('error_fields');
    $(".error_area").html("");
    $(".error_area").hide();

    $("[class*='has-error']").each(function(){
        $(this).removeClass("has-error");
    });

    $("[class*='help-block']").each(function(){
        $(this).html('');
    });

    $("label").each(function(){
        $(this).removeAttr('style');
    });

    new FormValidator(formId, errorObj , function(errors, evt) {

        if(errors.length>0){
            $(".error_area").show();
            $.each(errors,function(k,v){
                $("#field_"+ v.id).addClass('has-error');
                $("#"+ v.id+"_field").addClass('has-error');
                $("label[for='"+v.id+"']").attr("style","color:#d9534f;");
                $("#"+ v.name+"_field").addClass('has-error');
                $("label[for='"+v.name+"']").attr("style","color:#d9534f;");
                $(".error_area").append(v.message+"<br/>");

            });

            $('html,body').animate({
                scrollTop: $("div.error_area").offset().top
            }, 1000);
            return false;
        }
        else{
            var flag = 0;
            if(flag == 1){
                $(".error_area").show();
                $('html,body').animate({
                    scrollTop: $(".error_area").offset().top
                }, 1000);
                return false;
            }

            $.ajax({
                type: "POST",
                processData : false,
                url: urlParam,
                data: formData,
                success: function(data)
                {
                    data = JSON.parse(JSON.stringify(data));
                    if(200 == data.status){
                        window.location.href=data.redirect;
                    } else{
                         $(".error_area").show();
                        $.each(data,function(k,v){
                            $("#field_"+k).addClass("has-error");
                            $("#"+k+"_field").addClass('has-error');
                            $("label[for='"+k+"']").attr("style","color:#d9534f;");
                            $(".error_area").append(v[0]+"<br/>");

                            $('html,body').animate({
                                scrollTop: $(".error_area").offset().top
                            }, 1000);
                        });
                    }
                },
                error :function(data,e)
                {
                    alert("error"+e);
                }
            });
        }
    });
}
