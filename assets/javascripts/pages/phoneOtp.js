var nexxo = nexxo || {};
nexxo.phoneOtp = nexxo.phoneOtp || (function(){
    var _fetchStatusInterval;

    function isNullOrEmpty(param){
        return (param == null || typeof param == "undefined" || undefined == param || $.trim(param).length == 0);
    }

    function showModalMessage(message, isSuccess){
        if(!isNullOrEmpty(message)) {
            $("#successMsgID, #errorMsgID").remove();
            if (!isSuccess) {
                $('#modal-errorMessage').css('display', 'block');
                $('#modal-errorMessage').removeClass('alert-success').addClass('alert-danger');
                $('#modal-errorMessage').text(message);
            } else {
                $('#modal-errorMessage').css('display', 'block');
                $('#modal-errorMessage').addClass('alert-success').removeClass('alert-danger');
                $('#modal-errorMessage').text(message);
            }
        }
    }

    function hideModalMessage(){
        $('#modal-errorMessage').css('display', 'none');
        $('#modal-errorMessage').removeClass('alert-success').removeClass('alert-danger');
        $('#modal-errorMessage').text("");
    }

    function countdown() {
        if (timeLeft == -1) {
            clearTimeout(timerId);
            enableOTPResend();
        } else {
            elem.innerHTML = timeLeft + ' seconds remaining';
            timeLeft--;
            $(".reSendPhoneOTP").attr("disabled", "disabled");
        }
    }

    function enableOTPResend() {
        $(".reSendPhoneOTP").removeAttr("disabled", "disabled");
    }

    function restartOTPCountDown(){
        timeLeft = 30;
        elem = document.getElementById('countTimer');
        timerId = setInterval(countdown, 1000);
        countdown();
    }

    return {
        init: function(){
            'use strict';
            clearInterval(_fetchStatusInterval);

            $(".reSendPhoneOTP").on('click',function(e) {
                /*if (isNullOrEmpty($(this).attr('disabled'))) {*/
                    e.preventDefault();
                    /*restartOTPCountDown();*/
                    nexxo.phoneOtp.reSendPhoneOTP();
                /*}else return false;*/
            });

            $("#changePhoneForOTP").on('click',function(e) {
                window.location.href = '/reRenderPersonInfo';
               return false;
            });

        }, reSendPhoneOTP: function(){
            hideModalMessage(); $("#phoneOtp").val(''); clearInterval(_fetchStatusInterval);

                $.ajax({
                    type: "GET",
                    processData : false,
                    url: "/sendPhoneOTP",
                    data: "",
                    success: function(response)
                    {
                        if (!isNullOrEmpty(response)){
                            if(200 == response.status){
                                showModalMessage(response.info, true);
                                _fetchStatusInterval = setInterval(nexxo.phoneOtp.fetchMessageStatus(response.sid), 5000);
                            }else { showModalMessage(response.info, false); }

                            /*restartOTPCountDown();*/
                        }
                        return false;
                    },
                    error :function(e)
                    {
                        showModalMessage("An issue occurred while sending OTP.", false);
                    }
                });

        },validatePhoneOTP: function(){
            var _phoneOtp = $("#phoneOtp").val();
            var _personId = $("#personId").val();

            if(isNullOrEmpty(_phoneOtp)){
                $("div#field_phoneOtp").addClass("has-error");
                $("#field_phoneOtp .help-block").html("Please enter OTP for Phone Number.");
            }else{
                $("input#otpBTN").attr("style","pointer-event:none;");
                $.ajax({
                    type: "GET",
                    processData : false,
                    url: "/validatePhoneOTP/"+_personId+"/"+_phoneOtp,
                    data: "",
                    success: function(response)
                    {
                        $("input#otpBTN").removeAttr("style");
                        if (!isNullOrEmpty(response)){
                            if(200 == response.status){
                                window.location.href = '/watchvideo';
                            }else {showModalMessage(response.info, false);}
                        }
                        return false;
                    },
                    error :function(e)
                    {
                        $("input#otpBTN").removeAttr("style");
                        showModalMessage("An issue occurred while validating OTP.", false);
                    }
                });
            }
        },fetchMessageStatus: function(sid){

              if(!isNullOrEmpty(sid)){
                $.ajax({
                    type: "GET",
                    processData : false,
                    url: "/fetchMsgStatus/"+sid,
                    data: "",
                    async: true,
                    success: function(response)
                    {
                        if (!isNullOrEmpty(response) && 200 != response.status){
                            clearInterval(_fetchStatusInterval);
                            showModalMessage(response.info, false);
                        }
                    },error :function(e)
                    {
                        showModalMessage("An issue occurred while fetching status.", false);
                    }
                });
            }
        }
    }
}());