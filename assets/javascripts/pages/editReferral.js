//Plug-in function for the bootstrap version of the multiple email
    $(function() {

        //To render the input device to multiple email input using BootStrap icon

        $("#updateRefer").click(function(e){
           e.preventDefault();

            if(isFormValid()){
                $('#updateRefer').addClass('btn-secondary').attr('disabled',"disabled");
                var $data = [];
                $('.user-contacts').find('.row').each(function (i, el) {
                    var fNameVal = $(this).find('#form_fName').val();
                    var lNameVal = $(this).find('#form_lName').val();
                    var emailVal = $(this).find('#form_email').val();
                    var uuidVal = $(this).find('#form_uuid').val();
                    var $row = { firstName: fNameVal, lastName: lNameVal, email: emailVal,uuid: uuidVal};
                    $data.push($row);
                });
                console.log($data);

                $.ajax({
                   type: "POST",
                   url: "/edit/referfriends",
                   data: JSON.stringify($data),
                   dataType: 'json',
                   contentType: 'application/json',
                   success: function(result) {
                       window.location.href = '/loggeduserdashboard';
                   },
                   error: function(result) {
                       window.location.href = '/loggeduserdashboard';
                   }
               });
            }
        });




        function isFormValid() {
            var isValid = false;
            if(isAnyFieldBlank()){
                $('#errorMessage').css('visibility', 'visible');
                $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
                $('#errorMessage').text("Please enter all values");
                isValid = false;
            } else if(isEmailInValid()){
                $('#errorMessage').css('visibility', 'visible');
                $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
                $('#errorMessage').text("Please enter valid email ids");
                isValid = false;
            } else{
                $('#errorMessage').css('visibility', 'hidden');
                $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
                $('#errorMessage').text("");
                isValid = true;
            }
            return isValid;
        }

        function isAnyFieldBlank() {
            var isEmpty = false;
            var allFieldsValid = false;
            $(".user-contacts input")  // for all checkboxes
                .each(function() {
            		var input = $(this).val();
            		if(input == "" || input == null){
            		    isEmpty = true;
            		} else{
            		    allFieldsValid = true;
            		}
            });
            return isEmpty;
        }

        function isEmailInValid() {
            var emailInValid = false;
            var allEmailsFilled = false;
            var allEmailsValid = false;
            var regexEmail = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
            $(".user-contacts input[name=email]")  // for all checkboxes
                .each(function() {
                    var input = $(this).val();
                    console.log(input);
                    if(input == "" || input == null){
                        allEmailsFilled = false;
                    } else{
                        if(regexEmail.test(input)){
                            allEmailsValid = true;
                        } else{
                            emailInValid = true;
                        }
                    }
            });
            return emailInValid;
        }

    });

