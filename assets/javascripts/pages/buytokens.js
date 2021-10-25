//Plug-in function for the bootstrap version of the multiple email
$(function() {
    var fiatPerNexxoTokensExchangeRateVal = null;
    var fiatPerNexxoTokensExchangeRateStr = null;
    var btcPerNexxoTokensExchangeRateVal = null;
    var btcPerNexxoTokensExchangeRateStr = null;
    var ethPerNexxoTokensExchangeRateVal = null;
    var ethPerNexxoTokensExchangeRateStr = null;

    var nexxoTokensPerFiatExchangeRateVal = null;
    var nexxoTokensPerFiatExchangeRateStr = null;
    var nexxoTokensPerBTCExchangeRateVal = null;
    var nexxoTokensPerBTCExchangeRateStr = null;
    var nexxoTokensPerETHExchangeRateVal = null;
    var nexxoTokensPerETHExchangeRateStr = null;

    initializePage();

    $('select#currencyVal').on('change', function(){
        var value = $(this).val();
        var currencyValueToBePaid = getPaymentAmountInCurrency($('input[name=currencyRadioBtn][name=currencyRadioBtn]:checked').val());
        switch(value){
            case "1":
            case "2":
            case "3":
            case "4":
                $('#paymentOtherField').css('display','none');
                $('input#othersVal').val("");
                break;
            case "5":
                $('#paymentOtherField').css('display','flex');
                $('input#othersVal').val(minFiatCurrencyPaymentAllowed().toFormat(2));
                break;
        }
        populatePaymentDetails();
    });

    $('input[type=radio][name=currencyRadioBtn]').on('change', function() {
         switch($(this).val()) {
             case 'USD':
                //toggle drop down
                $('.PayAmt').css('display','flex');
                $('#paymentOtherField').css('display','none');
                //set value for other field label
                $('#paymentOtherField label[for="othersVal"]').text("");
                $('input#othersVal').val("");
                //reset drop down
                $('#currencyVal').prop("selectedIndex", 0);

                //set exchange rate
                $('#exchangeUnitValue').text("1 "+$(this).val());
                $('#tokensPerCurrencyUnitDiv').val(nexxoTokensPerFiatExchangeRateVal.toFormat(0)+" Nexxo Tokens");


                //setup destination for sending currency
                $('#modal-usd').css('display','block');
                $('#modal-btc').css('display','none');
                $('#modal-eth').css('display','none');

                break;
             case 'BTC':
                $('.PayAmt').css('display','none');
                $('#paymentOtherField').css('display','flex');
                console.log(minBTCCurrencyPaymentAllowed().toFormat(8));
                $('input#othersVal').val(minBTCCurrencyPaymentAllowed().toFormat(8));
                $('#paymentOtherField label[for="othersVal"]').text("Payment Amount in "+$(this).val());

                //set exchange rate
                $('#exchangeUnitValue').text("1 "+$(this).val());
                $('#tokensPerCurrencyUnitDiv').val(nexxoTokensPerBTCExchangeRateVal.toFormat(0)+" Nexxo Tokens");


                //setup destination for sending currency
                $('#modal-usd').css('display','none');
                $('#modal-btc').css('display','block');
                $('#modal-eth').css('display','none');

                break;
             case 'ETH':
                $('.PayAmt').css('display','none');
                $('#paymentOtherField').css('display','flex');
                console.log(minETHCurrencyPaymentAllowed().toFormat(18));
                $('input#othersVal').val(minETHCurrencyPaymentAllowed().toFormat(18));
                $('#paymentOtherField label[for="othersVal"]').text("Payment Amount "+$(this).val());

                //set exchange rate
                $('#exchangeUnitValue').text("1 "+$(this).val());
                $('#tokensPerCurrencyUnitDiv').val(nexxoTokensPerETHExchangeRateVal.toFormat(0)+" Nexxo Tokens");


                //setup destination for sending currency
                $('#modal-usd').css('display','none');
                $('#modal-btc').css('display','none');
                $('#modal-eth').css('display','block');

                break;
         }
         populatePaymentDetails();
    });

    $('input#othersVal').on('input',function(e){
        populatePaymentDetails();
    });


    $.fn.digits = function(){
        return this.each(function(){
            $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
        })
    }

    function delimitNumbers(str) {
      return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
        return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
      });
    }


    function populatePaymentDetails(){
        hideMessage();
        var currencyCodeSelected = $('input[name=currencyRadioBtn][name=currencyRadioBtn]:checked').val();
        var currencyValueToBePaid = getPaymentAmountInCurrency(currencyCodeSelected);
        var nexxoTokensReceivable = getNexxoTokensValuePerPaymentAmount(currencyCodeSelected, currencyValueToBePaid);

        //populate the locations appropriately
        switch(currencyCodeSelected){
            case 'USD':
                $('div#pay-amnt-modal-usd').text(currencyValueToBePaid.toFormat(2));
                $('input#nexxo-tokens-purchased-usd').val(nexxoTokensReceivable.toFormat(0) + " Nexxo Tokens");
                break;
            case 'BTC':
                $('div#pay-amnt-modal-btc').text(currencyValueToBePaid.toFormat(10));
                $('input#nexxo-tokens-purchased-btc').val(nexxoTokensReceivable.toFormat(0) + " Nexxo Tokens");
                break;
            case 'ETH':
                $('div#pay-amnt-modal-eth').text(currencyValueToBePaid.toFormat(18));
                $('input#nexxo-tokens-purchased-eth').val(nexxoTokensReceivable.toFormat(0) + " Nexxo Tokens");
                break;
        }
        //check if nexxo tokens receivable is more than 0, enable button.
        if(nexxoTokensReceivable.toNumber() > 0){
            $('#buyTokensBtn').addClass('btn-primary');
            $('#buyTokensBtn').removeClass('btn-secondary');
            $('#buyTokensBtn').removeClass('btn-danger');
            $('#buyTokensBtn').removeAttr('disabled');
        } else{
            $('#buyTokensBtn').removeClass('btn-primary');
            $('#buyTokensBtn').addClass('btn-secondary');
            $('#buyTokensBtn').attr('disabled',"disabled");
        }
    }

    
    function getNexxoTokensValuePerPaymentAmount(currencyCode, paymentAmount){
        var nexxoTokensPerPaymentAmount = new BigNumber(0);
        if(paymentAmount == null){
            paymentAmount = new BigNumber(0);
        }
        switch(currencyCode){
            case 'USD':
                console.log("getNexxoTokensValuePerPaymentAmount"+nexxoTokensPerFiatExchangeRateVal);
                nexxoTokensPerPaymentAmount = nexxoTokensPerFiatExchangeRateVal.times(paymentAmount);
                break;
            case 'BTC':
                console.log(nexxoTokensPerBTCExchangeRateVal);
                nexxoTokensPerPaymentAmount = nexxoTokensPerBTCExchangeRateVal.times(paymentAmount);
                break;
            case 'ETH':
                console.log(nexxoTokensPerETHExchangeRateVal);
                nexxoTokensPerPaymentAmount = nexxoTokensPerETHExchangeRateVal.times(paymentAmount);
                break;
        }

        return nexxoTokensPerPaymentAmount;
    }

    function getPaymentAmountInCurrency(currencyCode){
        console.log(currencyCode);
        var currencyValueToBePaid = 0;
        switch(currencyCode) {
        case 'USD':
            //get the value from the drop down
            var dropDownVal = $('select#currencyVal option:selected').val();
            console.log(dropDownVal)
            switch(dropDownVal){
                case "1":
                    currencyValueToBePaid = new BigNumber(500);
                    break;
                case "2":
                    currencyValueToBePaid = new BigNumber(1000);
                    break;
                case "3":
                    currencyValueToBePaid = new BigNumber(2000);
                    break;
                case "4":
                    currencyValueToBePaid = new BigNumber(5000);
                    break;
                case "5":
                    currencyValueToBePaid = (isNaN($("input#othersVal").val()) || $("input#othersVal").val() == "") ? new BigNumber(0) : new BigNumber($("input#othersVal").val());
                    break;
            }
            console.log("inn USD")
            break;
        case 'BTC':
            currencyValueToBePaid = (isNaN($("input#othersVal").val()) || $("input#othersVal").val() == "") ? new BigNumber(0) : new BigNumber($("input#othersVal").val());;
            console.log("in BTC");
            break;
        case 'ETH':
            currencyValueToBePaid = (isNaN($("input#othersVal").val()) || $("input#othersVal").val() == "") ? new BigNumber(0) : new BigNumber($("input#othersVal").val());;
            console.log("in ETH");
            break;
        }
        return currencyValueToBePaid;
    }


    function fetchDataFromHiddenFields(){
        fiatPerNexxoTokensExchangeRateVal = isNaN($("#fiatPerNexxoTokensExchangeRate").val()) ? new BigNumber(0) : new BigNumber($("#fiatPerNexxoTokensExchangeRate").val());
        fiatPerNexxoTokensExchangeRateStr = $("#fiatPerNexxoTokensExchangeRateStr").val();
        btcPerNexxoTokensExchangeRateVal = isNaN($("#btcPerNexxoTokensExchangeRate").val()) ? new BigNumber(0) : new BigNumber($("#btcPerNexxoTokensExchangeRate").val());
        btcPerNexxoTokensExchangeRateStr = $("#btcPerNexxoTokensExchangeRateStr").val();
        ethPerNexxoTokensExchangeRateVal = isNaN($("#ethPerNexxoTokensExchangeRate").val()) ? new BigNumber(0) : new BigNumber($("#ethPerNexxoTokensExchangeRate").val());
        ethPerNexxoTokensExchangeRateStr = $("#ethPerNexxoTokensExchangeRateStr").val();

        nexxoTokensPerFiatExchangeRateVal = isNaN($("#nexxoTokensPerFiatExchangeRate").val()) ? new BigNumber(0) : new BigNumber($("#nexxoTokensPerFiatExchangeRate").val());
        nexxoTokensPerFiatExchangeRateStr = $("#nexxoTokensPerFiatExchangeRateStr").val();
        nexxoTokensPerBTCExchangeRateVal = isNaN($("#nexxoTokensPerBTCExchangeRate").val()) ? new BigNumber(0) : new BigNumber($("#nexxoTokensPerBTCExchangeRate").val());
        nexxoTokensPerBTCExchangeRateStr = $("#nexxoTokensPerBTCExchangeRateStr").val();
        nexxoTokensPerETHExchangeRateVal = isNaN($("#nexxoTokensPerETHExchangeRate").val()) ? new BigNumber(0) : new BigNumber($("#nexxoTokensPerETHExchangeRate").val());
        nexxoTokensPerETHExchangeRateStr = $("#nexxoTokensPerETHExchangeRateStr").val();

    }

    function minFiatCurrencyPaymentAllowed(){
        var minCurrencyAllowed = new BigNumber($("select#currencyVal option:first").attr("name"));
        return minCurrencyAllowed;
    }

    function minNexxoTokensPurchaseAllowed(){
        var minFiatAllowed = minFiatCurrencyPaymentAllowed();
        var minNexxoTokens = nexxoTokensPerFiatExchangeRateVal.times(minFiatAllowed);
        return minNexxoTokens;
    }

    function minBTCCurrencyPaymentAllowed(){
        var minNexxoTokens = minNexxoTokensPurchaseAllowed();

        var minBITAllowed = btcPerNexxoTokensExchangeRateVal.times(minNexxoTokens);
        return minBITAllowed;
    }

    function minETHCurrencyPaymentAllowed(){
        var minNexxoTokens = minNexxoTokensPurchaseAllowed();

        var minETHAllowed = ethPerNexxoTokensExchangeRateVal.times(minNexxoTokens);
        return minETHAllowed;
    }

    /**
     *  Functions to copy address to clipboard
     */
    $("#copyBTCWalletAddr").click(function(e){
        e.preventDefault();
        var copyLinkElement = $('#cryptoBTCWalletValue-nexxo');
        copyLinkToClipboard(copyLinkElement);
    });

    $("#copyETHWalletAddr").click(function(e){
        e.preventDefault();
        var copyLinkElement = $('#cryptoETHWalletValue-nexxo');
        copyLinkToClipboard(copyLinkElement);
    });

    function copyLinkToClipboard(element){
        element.select();
        /* Copy the text inside the text field */
        document.execCommand("copy");
        alert("Address Copied");
    }

    /**
     *  Show and hide error messages
     */
    function showMessage(message, isSuccess){
        console.log(message);
        if(!isSuccess){
            $('.errorMessage').css('display', 'block');
            $('#buyTokensBtn').addClass('btn-danger');
            $('#buyTokensBtn').removeClass('btn-primary');
            $('.errorMessage').removeClass('alert-success').addClass('alert-danger');
            $('.errorMessage').text(message);
        } else{
            $('.errorMessage').css('display', 'block');
            $('#buyTokensBtn').addClass('btn-primary');
            $('#buyTokensBtn').removeClass('btn-danger');
            $('.errorMessage').addClass('alert-success').removeClass('alert-danger');
            $('.errorMessage').text(message);
        }
    }

    function hideMessage(){
        $('.errorMessage').css('display', 'none');
        $('.errorMessage').removeClass('alert-success').removeClass('alert-danger');
        $('.errorMessage').text("");
    }

    function showModalMessage(message, isSuccess){
        if(!isSuccess){
            $('#modal-errorMessage').css('display', 'block');
            $('#modal-errorMessage').removeClass('alert-success').addClass('alert-danger');
            $('#modal-errorMessage').text(message);
        } else{
            $('#modal-errorMessage').css('display', 'block');
            $('#modal-errorMessage').addClass('alert-success').removeClass('alert-danger');
            $('#modal-errorMessage').text(message);
        }
    }

    function hideModalMessage(){
        $('#modal-errorMessage').css('display', 'none');
        $('#modal-errorMessage').removeClass('alert-success').removeClass('alert-danger');
        $('#modal-errorMessage').text("");
    }

    function isPurchaseValid(){
        var currencyValueToBePaid = new BigNumber(0);

        //check which currency is selected
        var currencyCode = $( 'input[name=currencyRadioBtn]:checked' ).val();
        var minAllowedPayment = new BigNumber(0);
        var paymentVal = getPaymentAmountInCurrency(currencyCode);
        var currencyFormat = 2;
        var isPaymentValid = false;
        //check if value to be paid is less than min value
        switch(currencyCode) {
            case 'USD':
                minAllowedPayment = minFiatCurrencyPaymentAllowed();
                currencyFormat = 2;
                break;
            case 'BTC':
                minAllowedPayment = minBTCCurrencyPaymentAllowed();
                currencyFormat = 8;
                break;
            case 'ETH':
                minAllowedPayment = minETHCurrencyPaymentAllowed()
                currencyFormat = 18;
                break;
        }

        //show error message
        console.log("paying - "+paymentVal);
        console.log("minimum - "+minAllowedPayment);
        if(paymentVal.dp(getCurrencyFormatForCurrencyCode(currencyCode)).gte(minAllowedPayment.dp(getCurrencyFormatForCurrencyCode(currencyCode)))){
            isPaymentValid = true;
            hideMessage();
        } else {
            isPaymentValid = false;
            showMessage("Minimum purchase should be worth "+minAllowedPayment.toFormat(currencyFormat)+" "+currencyCode, false);
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
        return isPaymentValid;
    }

    function getCurrencyFormatForCurrencyCode(currencyCode){
        var currencyFormat = 2;
        switch(currencyCode) {
            case 'USD':
                currencyFormat = 2;
                break;
            case 'BTC':
                currencyFormat = 8;
                break;
            case 'ETH':
                currencyFormat = 18;
                break;
        }

        return currencyFormat;
    }


    /**
     * User clicks confirmation message
     */
    $("#buyTokensBtn").click(function(e){
        e.preventDefault();
        //validate purchase
        if(isPurchaseValid()){
            console.log("initializing confirmation modal");
            initializeConfirmationModal();
            console.log("restarting OTP Countdown");
            restartOTPCountDown();
            console.log("send OTP method called");
            sendPhoneOTP();
        }
    });

    /**
     * Modal confirm click - final submit
     */
    $("#IBANBtn").click(function(e){
        e.preventDefault();
        //validate purchase
        if(isModalDetailsValid()){
            validatePhoneOTPAndConfirmPurchase();
        }
    });

    function isModalDetailsValid(){
        var sourceWallet = $('#sourceWalletValue').val();
        var submittedOTP = $('input#submittedOTP').val();
        var walletMsg = "";
        console.log(sourceWallet);

        //OTP has to be 6 characters digits
        isOTPValid = false;
        isWalletValid = false;
        areModalDetailsValid = false;
        var currencyCode = $( 'input[name=currencyRadioBtn]:checked' ).val();
        //check if value to be paid is less than min value
        switch(currencyCode) {
            case 'USD':
                if(!isIBANWalletValid(sourceWallet)){
                    walletMsg = "Please enter valid IBAN number";
                    isWalletValid = false;
                } else{
                    isWalletValid = true;
                }
                break;
            case 'BTC':
                if(!isBTCWalletValid(sourceWallet)){
                    walletMsg = "Please enter valid BTC Wallet";
                    isWalletValid = false;
                } else{
                    isWalletValid = true;
                }break;
            case 'ETH':
                if(!isETHWalletValid(sourceWallet)){
                    walletMsg = "Please enter valid ETH Wallet";
                    isWalletValid = false;
                } else{
                    isWalletValid = true;
                }break;
        }

        if(submittedOTP.length == 6){
            isOTPValid = true;
        } else {
            isOTPValid = false;
        }

        if(!isWalletValid){
            showModalMessage(walletMsg, false);
            areModalDetailsValid = false;
        } else if(!isOTPValid){
            showModalMessage("Pleae enter correct OTP", false);
            areModalDetailsValid = false;
        } else{
            areModalDetailsValid = true;
        }

        return areModalDetailsValid;
    }

   function sendPhoneOTP(){
       var _countryCode = $("#countryCode").val();
       var _phoneNo = $("#phoneNo").val();
       var _personId = $("#personId").val();

       if(isNullOrEmpty(_phoneNo)){
           alert('phone number is null');
       }else{
           console.log("send OTP initiated");
           $.ajax({
               type: "GET",
               processData : false,
               url: "/sendPhoneOTP/"+_personId+"/"+_countryCode+"/"+_phoneNo,
               data: "",
               success: function(response)
               {
                   console.log("send OTP successful");
                   if (response != null && undefined != response){
                       if(200 == response.status){
                           showModalMessage(response.info, true);
                       }else {
                           showModalMessage(response.info, false);
                       }

                   }
                   return false;
               },
               error :function(data,e)
               {
                   showModalMessage("Some error occured while sending OTP. Please try after some time", false);
               }
           });
       }
   }

   function validatePhoneOTPAndConfirmPurchase(){
       hideModalMessage();
       var _phoneOtp = $('input#submittedOTP').val();
       var _personId = $("#personId").val();

       if(isNullOrEmpty(_phoneOtp)){
           showModalMessage("Please enter valid OTP", false);
       }else{
           hideModalMessage();
           $.ajax({
               type: "GET",
               processData : false,
               url: "/validatePhoneOTP/"+_personId+"/"+_phoneOtp,
               data: "",
               success: function(response)
               {
                   if (response != null && undefined != response){
                       if(200 == response.status){
                            //disable button
                            //submit data for purchase
                            confirmPurchase();
                       }else {
                            showModalMessage(response.info, false);
                       }
                   }
                   return false;
               },
               error :function(data,e)
               {
                   showModalMessage("Error in OTP verification. Please try again.", false);
               }
           });
       }
   }

   /**
    * This method finally submits the value
    */
   function confirmPurchase(){

       showModalMessage("Submitting Purchase Details", true);
       $("#IBANBtn").css('display',"none");
       $(".resendOtp").attr("disabled", "disabled");

       var currencyCode = $('input[name=currencyRadioBtn]:checked').val();
       var currencyAmount = getPaymentAmountInCurrency($('input[name=currencyRadioBtn]:checked').val());
       var nexxoReceivables = getNexxoTokensValuePerPaymentAmount(currencyCode, currencyAmount);

       var $data = {
           paymentCurrencyCode :  currencyCode,
           currencyAmount : currencyAmount.toNumber(),
           tokenAmount : nexxoReceivables.toNumber(),
           cryptoPaymentWallet : $('#sourceWalletValue').val(),
           selectedExchangeRateId : getExchangeRateIdByCurrencyCode(currencyCode)
       }
       console.log($data);
       //simulate form post to ensure redirect happens
       //postForm('/buytokens', 'post', $data);

       $.ajax({
          type:'POST',
          url: '/buytokens',
          data:$data,
          success: function(result) {
               $('#modal-IBAN').modal('hide');
               initializePage();
               showMessage(result, true);
               $("html, body").animate({ scrollTop: 0 }, "slow");
               $.ajax({
                     type:'GET',
                     url: '/getpersondetails',
                     data:$data,
                     success: function(result) {
                          console.log(result);
                          getpersonwalletdetails();
                          //reset the form
                      },
                      error: function(data){
                     }
                 });
           },
           error: function(data){
              if(!isObject(data)){
                  if(data.toLowerCase() == "redirect".toLowerCase()){
                      window.location.href = '/logout';
                  }
              }
              console.log(data);
              $('#modal-IBAN').modal('hide');
              initializePage();
              showMessage(data.responseText, false);
              $("html, body").animate({ scrollTop: 0 }, "slow");
          }
       });

   }

    function getExchangeRateIdByCurrencyCode(currencyCode){
        var exchangeRateId = null;
        switch(currencyCode){
            case 'USD':
                exchangeRateId = $('#nexxoPerFiatCurrencyExchangeRateId').val()
                break;
            case 'BTC':
                exchangeRateId = $('#nexxoPerBTCExchangeRateId').val()
                break;
            case 'ETH':
                exchangeRateId = $('#nexxoPerETHExchangeRateId').val()
                break;
            default:
                exchangeRateId = $('#nexxoPerFiatCurrencyExchangeRateId').val()
                break;
        }
        return exchangeRateId;
    }
    function initializePage(){
        /*
         * ************************
         * Initial Setup
         * ************************
         */
        fetchDataFromHiddenFields();
        //disable the button
        $('#buyTokensBtn').addClass('btn-secondary').attr('disabled',"disabled");
        //check default value
        $( 'input[name=currencyRadioBtn][value="USD"]').prop('checked', true);
        $('.PayAmt').css('display','flex');
        $('#paymentOtherField').css('display','none');
        //set value for other field label
        $('#paymentOtherField label[for="othersVal"]').text("");

        //set exchange rate
        $('#exchangeUnitValue').text("1 "+$('input[name=currencyRadioBtn][name=currencyRadioBtn]:checked').val());
        $('#tokensPerCurrencyUnitDiv').val(nexxoTokensPerFiatExchangeRateVal.toFormat(0)+" Nexxo Tokens");

        //show appropriate destination for sending money
        $('#modal-usd').css('display','block');
        $('#modal-btc').css('display','none');
        $('#modal-eth').css('display','none');

        //update payment details
        populatePaymentDetails();

    }

    function postForm(action, method, input) {
        'use strict';
        var form;
        form = $('<form />', {
            action: action,
            method: method,
            style: 'display: none;'
        });
        if (typeof input !== 'undefined' && input !== null) {
            $.each(input, function (name, value) {
                $('<input />', {
                    type: 'hidden',
                    name: name,
                    value: value
                }).appendTo(form);
            });
        }
        form.appendTo('body').submit();
    }

    function initializeConfirmationModal(){

        //check the validity of wallet in case of crypto payment
        var selValue = $( 'input[name=currencyRadioBtn]:checked' ).val();
        switch(selValue){
            case 'USD':
                $('label[for="sourceWalletValue"]').text("Please enter your IBAN.");
                $('input#sourceWalletValue').attr("placeholder", "IBAN number.");
                break;
            case 'BTC':
                $('label[for="sourceWalletValue"]').text("Please enter your BTC wallet address");
                $('input#sourceWalletValue').attr("placeholder", "BTC wallet address");
                break;
            case 'ETH':
                $('label[for="sourceWalletValue"]').text("Please enter your ETH wallet address");
                $('input#sourceWalletValue').attr("placeholder", "ETH wallet address");
                break;

        }

        //reset the modal
        hideModalMessage();
        $('#sourceWalletValue').val("");
        $('input#submittedOTP').val("");
        $("#IBANBtn").css('display',"block");
        $('#modal-IBAN').modal('show');

    }

    function countdown() {
        if (timeLeft == -1) {
            clearTimeout(timerId);
            enableOTPResend();
        } else {
            elem.innerHTML = timeLeft + ' seconds remaining';
            timeLeft--;
            $(".resendOtp").attr("disabled", "disabled");
        }
    }

    function enableOTPResend() {
        $(".resendOtp").removeAttr("disabled", "disabled");

    }

    function restartOTPCountDown(){
        timeLeft = 30;
        elem = document.getElementById('countTimer');
        timerId = setInterval(countdown, 1000);
        countdown();
    }

    $(".resendOtp").click(function(e){
        e.preventDefault();
        restartOTPCountDown();
        sendPhoneOTP();
    });

    function isNullOrEmpty(param){
        return (param == null || typeof param == "undefined" || undefined == param || $.trim(param).length == 0);
    }

    /*
     * Regex version - not fool proof
     */
    function isIBANWalletValid(str){
     return /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/.test(str);
    }

    /*
     * Much more comprehensive way of checking - 95% accurate
     */
    function isIBANValid(iban) {
      const ibanStripped = iban.replace(/[^A-Z0-9]+/gi,'') //keep numbers and letters only
                               .toUpperCase(); //calculation expects upper-case
      const m = ibanStripped.match(/^([A-Z]{2})([0-9]{2})([A-Z0-9]{9,30})$/);
      if(!m) return false;

      const numbericed = (m[3] + m[1] + m[2]).replace(/[A-Z]/g,function(ch){
                            //replace upper-case characters by numbers 10 to 35
                            return (ch.charCodeAt(0)-55);
                        });
      //The resulting number would be to long for javascript to handle without loosing precision.
      //So the trick is to chop the string up in smaller parts.
      const mod97 = numbericed.match(/\d{1,7}/g)
                              .reduce(function(total, curr){ return Number(total + curr)%97},'');

      return (mod97 === 1);
    };

    function isBTCWalletValid(val) {
        console.log(val);
        var regexBTC = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
        console.log("BTC wallet - "+regexBTC.test(val));
        return regexBTC.test(val);
    }

    function isETHWalletValid(val) {
        console.log(val);
        var regexETH = /^0x[a-fA-F0-9]{40}$/;
        console.log("ETH wallet - "+regexETH.test(val));
        return regexETH.test(val);
    }

    function isObject(val) {
        if (val === null) { return false;}
        return ( (typeof val === 'function') || (typeof val === 'object') );
    }


});