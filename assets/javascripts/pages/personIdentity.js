var nexxo = nexxo || {};
nexxo.personIdentity = nexxo.personIdentity || (function(){

    function isNullOrEmpty(param){
        return (param == null || typeof param == "undefined" || undefined == param || $.trim(param).length == 0);
    }

    function getValidationRules(){
        var obj=[{}];
        /*obj.push({name: 'nationality',display: 'Nationality',rules: 'required'});*/
        obj.push({name: 'passportNo',display: 'Passport Number',rules: 'required'});
        obj.push({name: 'passportExpiryDate',display: 'Passport Expiry Date',rules: 'required'});
        return obj;
    }

    return {
        init: function(){
            'use strict';
        }, validateAndSubmit: function(){
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

            new FormValidator("personalIdentityForm",getValidationRules() , function(errors, event) {
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
                        scrollTop: $(".steps-progress-bar").offset().top
                    }, 1000);

                }else{
                    var isError = false;
                    var _psptExpiryDate = $("#passportExpiryDate").val();
                    var _dateRegex = /^\d{2}[-]\d{2}[-]\d{4}$/;
                    if(!isNullOrEmpty(_psptExpiryDate) && $.trim(_psptExpiryDate).length == 10 && _psptExpiryDate.match(_dateRegex)){
                        var psptExpiryArray = _psptExpiryDate.split("-");
                        var dateObj = new Date(psptExpiryArray[2], psptExpiryArray[1], psptExpiryArray[0]);

                        if(psptExpiryArray.length !=3 || dateObj == null || dateObj == undefined ||
                            psptExpiryArray[2].length !=4 || parseInt(psptExpiryArray[1])>12){
                            $("#field_passportExpiryDate .help-block").html("Please enter valid Passport Expiry Date(format# dd-MM-yyyy).");
                            isError = true;
                        }else if(dateObj <= new Date()){
                            $("#field_passportExpiryDate .help-block").html("Passport Expiry Date must be future date.");
                            isError = true;
                        }
                    }else{
                        $("#field_passportExpiryDate .help-block").html("Please enter valid Passport Expiry Date (format# dd-MM-yyyy).");
                        isError = true;
                    }

                    if(!isError){
                        $.ajax({
                            type: "POST",
                            processData : false,
                            url: "/saveOrUpdatePersonalInfo",
                            data: $("#personalIdentityForm").serialize(),
                            success: function(data)
                            {
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
                                            scrollTop: $(".steps-progress-bar").offset().top
                                        }, 1000);
                                    });
                                }
                            },
                            error :function(data,e){ }
                        });
                    }
                }
            });
            return false;
        }
    }
}());

$(document).ready(function(){
    console.log($('#passportExpiryDate').val());
    var expirtyDate = $('#passportExpiryDate').val();
    var passportNumber = $('#passportNumber').val();
    if(typeof expirtyDate !== 'undefined' && expirtyDate !== '' && typeof passportNumber !== 'undefined' && passportNumber !== '') {
        var dateData = expirtyDate.split("-");
        var date = dateData[0];
        var month = dateData[1];
        var year = dateData[2];
        $('#passportExpiryMonth').val(month);
        $('#passportExpiryDay').val(date);
        $('#passportExpiryYear').val(year);
        $("#passportNumber").prop("readonly", true);
        $("#passportExpiryDay").prop("readonly", true);
        $("#passportExpiryYear").prop("readonly", true);
        $('#passportExpiryMonth').attr("disabled", true);
        $('#passportExpiryMonth').css("background-color", "#e9ecef");
        $('#submitBtn').attr("disabled", true);

    }
    $("#passport-1").fileinput({
        theme: 'fa',
        uploadUrl: "/uploadKycDocument/passport-1/1/" + $("#personId").val(),
        allowedFileExtensions: ['jpg', 'png', 'gif'],
        overwriteInitial: false,
        maxFileSize:2000,
        maxFilesNum: 1,
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    });
});

$(".dropzone").dropzone({
    url: "/uploadKycDocument/passport-1/1/" + $("#personId").val(),
    error: function (file, response) {
        console.log("Erro");
        console.log(response);
    },
    success: function (file, response) {
        console.log("Sucesso");
        console.log(response);
        $('.nniicc-dropzoneParent').remove();
        if($('#personId').val() != "" && $('#passportExpiryDate').val() != "") {
            $('.kyctooltip').remove();
        }
        var respose = JSON.parse(file.response);
        var imgUrl = respose.imageUrl;
        var parentDiv = $('<div class="thumnails"></div>')
        $('.dropzonearea').append(parentDiv);
        var a = $('<a target="_blank" href=imgUrl></a>')
        a.attr("href", imgUrl);
        var img = $('<img src=imgUrl class = "img-thumbnail" alt="Forest" style="border-radius: 14px;padding: 5px;width: 338px;height: 254px;box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);"></img>')
        img.attr("src",imgUrl);
        a.appendTo(parentDiv)
        img.appendTo(a)
    },
    complete: function (file) {
        console.log("Complete");
    }
})

function getValidationRules(){
    var obj=[{}];
    /*obj.push({name: 'nationality',display: 'Nationality',rules: 'required'});*/
    obj.push({name: 'passportNo',display: 'Passport Number',rules: 'required'});
    obj.push({name: 'passportExpiryDate',display: 'Passport Expiry Date',rules: 'required'});
    return obj;
}

function validate() {
    $(".error_area").html("");
    var passportNumber = $('#passportNumber').val();
    if(passportNumber == "") {
        $(".error_area").append("Please enter a passport number.");
        $(".error_area").show();
        return false;
    }
    var month = $('#passportExpiryMonth').val();
    if(month == "00") {
        $(".error_area").append("Please select a month.");
        $(".error_area").show();
        return false;
    }
    var date = $('#passportExpiryDay').val();
    if(date == "") {
        $(".error_area").append("Please enter a date.");
        $(".error_area").show();
        return false;
    }
    else if(!$.isNumeric(date)) {
        $(".error_area").append("Date should be numeric only.");
        $(".error_area").show();
        return false;
    }
    else if(parseInt(date) < 1 || parseInt(date) > 31) {
        $(".error_area").append("Please enter a valid date.");
        $(".error_area").show();
        return false;
    }
    else if(parseInt(date) < 9) {
        date = "0"+date;
    }
    var year = $('#passportExpiryYear').val();
    if(year == "") {
        $(".error_area").append("Please enter a year.");
        $(".error_area").show();
        return false;
    }
    else if(!$.isNumeric(year)) {
        $(".error_area").append("Year should be numeric only.");
        $(".error_area").show();
        return false;
    }
    else if(year.length < 4) {
        $(".error_area").append("Please enter a 4 digit year.");
        $(".error_area").show();
        return false;
    }
    var completeDate = date+'-'+month+'-'+year;
    var d = new Date(year, month, date);
    if (!d.getFullYear() == year || !d.getMonth() == month || !d.getDate() == date) {
        $(".error_area").append("Please enter a valid date combination.");
        $(".error_area").show();
        return false;
    }

    $('#passportExpiryDate').val(completeDate);
    $('.error_fields').removeClass('error_fields');
    $(".error_area").html("");
    var obj=getValidationRules();
    new FormValidator("personIdentityForm", obj, function (errors, evt) {
        if (errors.length > 0) {
            $.each(errors, function (k, v) {
                $("#field_" + k).addClass("has-warning");
                $("#" + k + "_field").addClass('has-warning');
                $("label[for='" + k + "']").attr("style", "color:#d9534f;");
                $(".error_area").append(v[0] + "<br/>");
            });
            $(".error_area").show();
            return false;
        }
        else {
            var month = $('#passportExpiryMonth').val();
            var year = $('#passportExpiryYear').val();
            var date = $('#passportExpiryDay').val();
            var completeDate = date + '-' + month + '-' + year;
            $('#passportExpiryDate').val(completeDate);
            $.ajax({
                type: "POST",
                processData: false,
                url: "/saveOrUpdatePersonIdentityInfo",
                data: $("#personIdentityForm").serialize(),
                success: function (data) {
                    data = JSON.parse(JSON.stringify(data));
                    console.log(data);
                    if (200 == data.status) {
                        window.location.href = data.redirect;
                    } else {
                        $.each(data, function (k, v) {
                            $("#field_" + k).addClass("has-warning");
                            $("#" + k + "_field").addClass('has-warning');
                            $("label[for='" + k + "']").attr("style", "color:#d9534f;");
                            $(".error_area").append(v[0] + "<br/>");
                        });
                        $(".error_area").show();
                    }
                },
                error: function (data, e) {
                }
            });
        }
    });
}