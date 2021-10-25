//Plug-in function for the bootstrap version of the multiple email
$(function() {

    $("#loginBtn1").click(function(e){
       e.preventDefault();
       $('#loginBtn').addClass('btn-secondary').attr('disabled',"disabled");
       /*window.location.href = '/referralhistory'

       var $data = {
            referralList :  JSON.parse($('#emails').val()),
            type : "object"

       }
       $.ajax({
           type: "POST",
           url: "/referfriends",
           data:$data,
           success: function(result) {
               window.location.href = '/referralhistory';
           },
           error: function(result) {
               window.location.href = '/referralhistory';
           }
       });*/

        var $data = {
            email :  $('#loginForm #email').val(),
            password : $('#loginForm #password').val()
       }
        console.log($data);
       $.ajax({
           type:'POST',
           url: '/login',
           data:$data,
           success:function(data){
               window.location.href = '/personListPage';
           },
           error: function(data){
               console.log(data.responseText);
               $('#errorMessageLogin').css('visibility', 'visible');
               $('#errorMessageLogin').text(data.responseText);
               $('#loginBtn').removeClass('btn-secondary').removeAttr('disabled');
           }
       });
    });


});