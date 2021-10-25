//Plug-in function for the bootstrap version of the multiple email
    $(function() {
        var minimumReferralsReq = 2;
        var inputsAdded = 1;
         $('#form_fName').val('');
         $('#form_lName').val('');
          $('#form_email').val('');
        //To render the input device to multiple email input using BootStrap icon
        $('#noOfReferrals').text((minimumReferralsReq-1) + " more referrals required...");
        //disable button
//        $('#referBtn').addClass('btn-secondary').attr('disabled',"disabled");


        $('#btnWhatsApp').attr("data-url",$('#copy-input').val());
        $('#btnLinkedin').attr("data-url",$('#copy-input').val());
        $('#btnFacebook').attr("data-url",$('#copy-input').val());

        $("#referBtnModal").click(function(e){
			
           e.preventDefault();
          $('#errorMessage').css('display', 'none');
         $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
         $('#errorMessage').text("");
           //remove old error highlights if exists
           $(".user-contacts input").removeClass("errorInput");
           $(".user-contacts input[name=email]").removeClass("errorInput");

            if(isFormValid()){

                $('#referBtn').addClass('btn-secondary').attr('disabled',"disabled");
                var $data = [];
               $('.user-contacts').find('.row').each(function (i, el) {
                    var fNameVal = $('#form_fName').val();
                    var lNameVal = $('#form_lName').val();
                    var emailVal = $('#form_email').val();
                    var $row = { firstName: fNameVal, lastName: lNameVal, email: emailVal};
                    $data.push($row);
                });
                console.log($data);

                $.ajax({
                   type: "POST",
                   url: "/referfriends",
                   data: JSON.stringify($data),
                   dataType: 'json',
                   contentType: 'application/json',
                   success: function(result) {
                   console.log(result);
                       //window.location.href = '/loggeduserdashboard';
                        $('#form_fName').val('');
                        $('#form_lName').val('');
                        $('#form_email').val('');
                        $('#errorMessage').css('display', 'block');
                        $('#errorMessage').removeClass('alert-danger').addClass('alert-success');
                        $('#errorMessage').text("Invite sent successfully.");
                        $('#referBtn').removeClass('btn-secondary').removeAttr('disabled');
                   },
                   error: function(result) {
                    console.log(result);
                       //window.location.href = '/loggeduserdashboard';
                         $('#errorMessage').css('display', 'block');
                       $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
                       $('#errorMessage').text("There is some error, please try again.");
                       $('#referBtn').removeClass('btn-secondary').removeAttr('disabled');
                   }
               });
            }
        });


         $("#copy-button").click(function(e){
                e.preventDefault();
                var copyLinkElement = $('#copy-input');
                copyLinkToClipboard(copyLinkElement);
            });

        function isFormValid() {
            var isValid = false;
            if(isAnyFieldBlank()){
                $('#errorMessage').css('display', 'block');
                $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
                $('#errorMessage').text("Please enter all values");
                isValid = false;
            } else if(isEmailInValid()){
                $('#errorMessage').css('display', 'block');
                $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
                $('#errorMessage').text("Please enter valid email ids");
                isValid = false;
            } else{
                $('#errorMessage').css('display', 'none');
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
						$(this).addClass('errorInput')
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
							$(this).addClass('errorEmail');
                        }
                    }
            });
            return emailInValid;
        }
		
		generatereferralsRows();
		$("#myModal").modal("show"); 

    });

    function clickTab(value){
        $('#errorMessage').css('display', 'none');
        $('#errorMessage').removeClass('alert-success').addClass('alert-danger');
        $('#errorMessage').text("");

        if(value == -1){
              $('#form_fName').val('');
             $('#form_lName').val('');
              $('#form_email').val('');
        }
        else if(value == -2){
            populateReferralHistory();
        }
      else {
            $('.nav-tabs a[href="#home"]').tab('show');

             $.ajax({
                   type: "GET",
                   url: "/getreferdata/"+value,
                   dataType: 'json',
                   contentType: 'application/json',
                   success: function(result) {
                       var data = result.split("|");
                       if(data.length > 1){
                            $('#form_fName').val(data[0]);
                            $('#form_lName').val(data[1]);
                             $('#form_email').val(data[2]);
                       }

                   },
                   error: function(result) {
                        $('#form_fName').val('');
                       $('#form_lName').val('');
                        $('#form_email').val('');
                   }
               });

        }
    }


function bindDataUrl(){

}

function populateReferralHistory(){

           var table = $('#dataTableReferHistory').dataTable( {
                    responsive: true,
                    autowidth: true,
                    destroy: true,
                    "bProcessing": true,
                    "bFilter": false,
                    "aaSorting": [[ 0, "asc" ]],
                    "ordering": false,
                    "iDisplayLength": 10,
                    "bServerSide": true,
                    "bJQueryUI": true,
                    "sPaginationType": "full_numbers",
                    "sAjaxSource": "/referralhistorylist",
                    "paging": true,
                    "fnInitComplete": function(){
                    },
                    "aoColumns" : [
                        {},
                        {},
                        {},
                        {},
                        {},
                        {},
                        {}
                    ]
                });
                $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            }


function copyLinkToClipboard(element){
        element.select();
        /* Copy the text inside the text field */
        document.execCommand("copy");
        alert("Enabler Link Copied");
    }
	
function generatereferralsRows() {

                            var numberoffreindsreferred = $("#numberoffreindsreferred").val();

                            if (numberoffreindsreferred < 5) {
                                for (i = 0; i <5; i++) {
                                    $(".user-contacts").append('<div class="row referral-details-row" style=""> <div class="col-md-4"> <label class="sr-only" for="form_fName">First Name</label> <input type="text" class="form-control txtbox mb-2 mr-sm-4" id="form_fName" placeholder="First Name" name="firstName" required="" aria-required="true"> </div> <div class="col-md-4"> <label class="sr-only" for="form_lName">Last Name</label> <input type="text" class="form-control txtbox mb-2 mr-sm-4" id="form_lName" placeholder="Last Name" name="lastName" required="" aria-required="true"> </div> <div class="col-md-4"> <label class="sr-only" for="form_email">Email</label> <input type="email" class="form-control txtbox mb-2 mr-sm-4" id="form_email" placeholder="Email" name="email" required="" aria-required="true"> </div> </div>');

                                }

                            } else {

                                $(".user-contacts").append('<div class="row referral-details-row" style=""> <div class="col-md-4"> <label class="sr-only" for="form_fName">First Name</label> <input type="text" class="form-control txtbox mb-2 mr-sm-4" id="form_fName" placeholder="First Name" name="firstName" required="" aria-required="true"> </div> <div class="col-md-4"> <label class="sr-only" for="form_lName">Last Name</label> <input type="text" class="form-control txtbox mb-2 mr-sm-4" id="form_lName" placeholder="Last Name" name="lastName" required="" aria-required="true"> </div> <div class="col-md-4"> <label class="sr-only" for="form_email">Email</label> <input type="email" class="form-control txtbox mb-2 mr-sm-4" id="form_email" placeholder="Email" name="email" required="" aria-required="true"> </div> </div>');

                            }

                        }	

