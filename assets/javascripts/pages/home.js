$(document).ready(function(){
    setupNavigationActiveLinks();
	$('#menuToggle').click(function(e){
		var $parent = $(this).parent('nav');
		$parent.toggleClass("open");
		var navState = $parent.hasClass('open') ? "hide" : "show";
        $('.navImg').css('display','block');

        $(this).attr("title", navState + " navigation");
			
			setTimeout(function(){
				console.log("timeout set");
				$('#menuToggle > span').toggleClass("navClosed").toggleClass("navOpen");
			}, 200);
    	e.preventDefault();
  	});

  	getpersondetails();
  	getpersonwalletdetails();
    getTokensSetup();
	
});
	
function closeSidebar(e) {
    var obj = event.target;
    var $parent = $('nav');
    $parent.toggleClass("open");
    var navState = $parent.hasClass('open') ? "hide" : "show";
    $(obj).attr("title", navState + " navigation");
    setTimeout(function () {
      $('#menuToggle > span').toggleClass("navClosed").toggleClass("navOpen");
    }, 200);
}


function getpersonwalletdetails(){
    $.ajax({
        type:'GET',
        url: '/getpersonwalletdetails',
        success: function(result) {
            if(!isObject(result)){

            } else{
                var commissionBonusWalletBalance = new BigNumber(result.commissionBonusWalletBalance.toString());
                var referralBonusWalletBalance = new BigNumber(result.referralBonusWalletBalance.toString());
                var purchasedWalletBalance = new BigNumber(result.purchasedWalletBalance.toString());
                var aggregateWalletBalance = new BigNumber(result.aggregateWalletBalance.toString());
                $('#verifiedPaymentTokenAccountBalance').text(commissionBonusWalletBalance.toFormat(0)+" tokens");
                $('#pendingPaymentTokenAccountBalance').text(referralBonusWalletBalance.toFormat(0)+" tokens");
                $('#bonusTokenAccountBalance').text(purchasedWalletBalance.toFormat(0)+" tokens");
                $('#totalBonus').html(commissionBonusWalletBalance.toFormat(0));
                $('#totalReferred').html(referralBonusWalletBalance.toFormat(0));
                $('#totalPurchase').html(purchasedWalletBalance.toFormat(0));
                $('#aggregateAllPurchase').html(aggregateWalletBalance.toFormat(0)+" ");
                $('#aggregateAllPurchase').append('<span style="font-weight:normal">Nexxo Tokens</span>');
            }
        },
        error: function(data){

        }
    });
}

function getpersondetails(){
    $.ajax({
        type:'GET',
        url: '/getpersondetails',
        success: function(result) {
            console.log(result);
            var name = result.firstName + ' ' + result.lastName;
            var enablerCode = result.enablerCode;
            $('#loggedInPersonName').text(name);
            $('#loggedInPersonEnablerCode').text(result.enablerCode);
            $('#loggedInPersonEnablerCodeMobile').text(result.enablerCode);
        },
        error: function(data){
        }
    });

}


function getTokensSetup(){
    $.ajax({
        type:'GET',
        url: '/getbonustokenssetup',
        success: function(result) {
            console.log(result);
            if(isObject(result)){
                var nexxoTokensPerReferralInvite = new BigNumber(result.nexxoTokensPerReferralInvite.toString()) != null ? new BigNumber(result.nexxoTokensPerReferralInvite.toString()) : new BigNumber(0);
                var nexxoTokensPer1000FiatCurrency = new BigNumber(result.nexxoTokensPer1000FiatCurrency.toString()) != null ? new BigNumber(result.nexxoTokensPer1000FiatCurrency.toString()) : new BigNumber(0);
                var fiatCurrencyPerNexxoTokenExchangeRate = new BigNumber(result.fiatCurrencyPerNexxoTokenExchangeRate.toString()) != null ? new BigNumber(result.fiatCurrencyPerNexxoTokenExchangeRate.toString()) : new BigNumber(0);
                $('#inviteNexxoTokensBtnVal').html(nexxoTokensPerReferralInvite.toFormat(0));
                $('#purchaseNexxoTokensBtnVal').html(nexxoTokensPer1000FiatCurrency.toFormat(0));
                $('#exchaneRateUsdPerNexxo').html(fiatCurrencyPerNexxoTokenExchangeRate.toFormat(5));

            }

            //reset the form
        },
        error: function(data){

        }
    });

}

function setupNavigationActiveLinks(){
    var pageId = $('input#page-id').val();
    switch(pageId){
        case 'refer-friends':
            $('.navbar_custom .nav-pills>li.active').removeClass('active');
            $('.navbar_custom .nav-pills>li>a.active').removeClass('active');
            $('.nav-referfriends').addClass('active');
            $('img.img-bucket-nav').each(function(){
                  // Get your image src
                  var source = $(this).attr('src');
                  // Replace all bucket image urls with light version of image
                  $(this).attr('src',source.replace(/_[a-z]+.[a-z]+/,'_light.png'));
              });

            $('img.img-bucket-nav.nav-referfriends').attr('src',"/assets/images/refer_dark.png");
            break;
        case 'purchase-tokens':
            $('.navbar_custom .nav-pills>li.active').removeClass('active');
            $('.navbar_custom .nav-pills>li>a.active').removeClass('active');
            $('.nav-purchasehistory').addClass('active');
            //replace all images with light version
            $('img.img-bucket-nav').each(function(){
                  // Get your image src
                  var source = $(this).attr('src');
                  // Replace all bucket image urls with light version of image
                  $(this).attr('src',source.replace(/_[a-z]+.[a-z]+/,'_light.png'));
              });

            $('img.img-bucket-nav.nav-purchasehistory').attr('src',"/assets/images/purchase_dark.png");
            break;
        case 'purchase-history':
            $('.navbar_custom .nav-pills>li.active').removeClass('active');
            $('.navbar_custom .nav-pills>li>a.active').removeClass('active');
            $('.nav-purchasehistory').addClass('active');
            $('img.img-bucket-nav').each(function(){
                  // Get your image src
                  var source = $(this).attr('src');
                  // Replace all bucket image urls with light version of image
                  $(this).attr('src',source.replace(/_[a-z]+.[a-z]+/,'_light.png'));
              });

            $('img.img-bucket-nav.nav-purchasehistory').attr('src',"/assets/images/purchase_dark.png");
            break;
        case 'bonus-commissions':
            $('.navbar_custom .nav-pills>li.active').removeClass('active');
            $('.navbar_custom .nav-pills>li>a.active').removeClass('active');
            $('.nav-bonuspage').addClass('active');
            $('.card card-default .cardBorderRadius .card-body img').each(function(){
                  // Get your image src
                  var source = $(this).attr('src');
                  // Replace all bucket image urls with light version of image
                  $(this).attr('src',source.replace(/_[a-z]+.[a-z]+/,'_light.png'));
              });

            $('img.img-bucket-nav.nav-bonuspage').attr('src',"/assets/images/trophy_dark.png");
            break;
        case 'person-kyc':
            $('.navbar_custom .nav-pills>li.active').removeClass('active');
            $('.navbar_custom .nav-pills>li>a.active').removeClass('active');
            $('.nav-kyc').addClass('active');
            break;
    }
}


function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}