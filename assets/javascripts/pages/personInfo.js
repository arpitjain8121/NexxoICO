var nexxo = nexxo || {};
nexxo.personInfo = nexxo.personInfo || (function(){

    function getValidationRules(){
        var obj=[{}];
        obj.push({name: 'firstName',display: 'First Name',rules: 'required'});
        obj.push({name: 'lastName',display: 'Last Name',rules: 'required'});
        obj.push({name: 'countryCode',display: 'Country Code',rules: 'required'});
        obj.push({name: 'phoneNo',display: 'Mobile Number (For SMS)',rules: 'required'});
        return obj;
    }

    return {
        init: function(){
            'use strict';
        }, validateAndFetchOTP: function(){
            $('.error_fields').removeClass('error_fields');
            $(".error_area").html("");
            $(".error_area").hide();

            $("[class*='has-warning']").each(function(){
                $(this).removeClass("has-warning");
            });

            $("[class*='help-block']").each(function(){
                $(this).html('');
            });

            $("label").each(function(){
                $(this).removeAttr('style');
            });

            new FormValidator("personalInfoForm",getValidationRules() , function(errors, evt) {
                if(errors.length>0){
                    $(".error_area").show();
                    $.each(errors,function(k,v){
                        $("#field_"+ v.id).addClass('has-warning');
                        $("#"+ v.id+"_field").addClass('has-warning');
                        $("label[for='"+v.id+"']").attr("style","color:#d9534f;");
                        $("#"+ v.name+"_field").addClass('has-warning');
                        $("label[for='"+v.name+"']").attr("style","color:#d9534f;");
                        $(".error_area").append(v.message+"<br/>");
                    });

                    $('html,body').animate({
                        scrollTop: $("#userSalutation").offset().top
                    }, 1000);

                }else{ nexxo.personInfo.submitPersonInfo(); }
            });

            return false;
        },submitPersonInfo: function(){
            $("input#personalInfoBtn").attr("style","pointer-event:none;");
            $.ajax({
                type: "POST",
                processData : false,
                url: "/saveOrUpdatePersonalInfo",
                data: $("#personalInfoForm").serialize(),
                success: function(data)
                {
                    $("input#personalInfoBtn").removeAttr("style");
                    data = JSON.parse(JSON.stringify(data));
                    if(200 == data.status){
                        window.location.href=data.redirect;
                    } else{
                        $(".error_area").show();
                        $.each(data,function(k,v){
                            $("#field_"+k).addClass("has-warning");
                            $("#"+k+"_field").addClass('has-warning');
                            $("label[for='"+k+"']").attr("style","color:#d9534f;");
                            $(".error_area").append(v[0]+"<br/>");

                            $('html,body').animate({
                                scrollTop: $("#userSalutation").offset().top
                            }, 1000);
                        });
                    }
                },
                error :function(data,e){ $("input#personalInfoBtn").removeAttr("style"); }
            });

            return true;
        }
    }
}());
