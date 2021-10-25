var nexxo = nexxo || {};
nexxo.kycUploadInfo = nexxo.kycUploadInfo || (function(){

    function displayResponse(message, isSuccess){
        if(!isSuccess){
            $('div#div-response').css('display', 'block');
            $('div#div-response').removeClass('alert-success').addClass('alert-danger');
            $('div#div-response').text(message);
        } else{
            $('div#div-response').css('display', 'block');
            $('div#div-response').addClass('alert-success').removeClass('alert-danger');
            $('div#div-response').text(message);
        }
    }

    function hideResponse(){
        $('div#div-response').css('display', 'none');
        $('div#div-response').removeClass('alert-success').removeClass('alert-danger');
        $('div#div-response').text("");
    }

    return {
        init: function(kycCompleteId, kycRejectId, currentKycStatusId, currentStatusMsg){
            'use strict';
            if(kycCompleteId == currentKycStatusId){
                displayResponse(currentStatusMsg, true);
            }else if(kycRejectId == currentKycStatusId){
                displayResponse(currentStatusMsg, false);
            }
        },validateUploadDoc: function(e){

            var event = window.event || e;
            var targetELE = event.target || event.srcElement;
            var isError = false;
            if(targetELE.id != null ) {
                var _divELE = $(targetELE).parent();
                var _FileELE = $(_divELE).find('input[type=file]');
                var _files = new Array();

                hideResponse();
                if(typeof _FileELE !== undefined){
                    var fileID = $(_FileELE).attr('id');
                    _files = document.getElementById(fileID).files;
                    if (typeof _files !== undefined && _files.length > 1) {
                        displayResponse( "Number of files: " + _files.length+". Maximum one file can be selected at a time.", false);
                        isError = true;
                    }
                }

                if (!isError) {
                    var fileName = _files[0].name.replace(/.*(\/|\\)/, '');
                    var fileExt = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
                    var rFileSize = _files[0].size;
                    var fileSize = (rFileSize / 1048576).toFixed(2);

                    if (!(fileExt === "pdf" || fileExt === "jpeg" || fileExt === "jpe" || fileExt === "jpg" || fileExt === "png" || fileExt === "bmp")) {
                        displayResponse("Selected file '"+fileName+"' for upload is '"+fileExt+"' format. Only pdf, png, jpeg, jpe, jpg, bmp formats are supported.",false);
                    }else if (!isError && rFileSize > 5242880) {
                        displayResponse("Selected file '"+fileName+"' for upload is '"+fileSize+" MB' which exceeds the maximum limit of 5 MB per document.",false);
                    }
                }
            }
        },uploadDocument: function(e,_fileElementId, _fileTypeId){
            if (!isNullOrEmpty($('div#div-response').attr('style')))
            {
                document.getElementById('uploadKycDiv').style.pointerEvents = 'none';
                $("#uploadKycDiv").attr("style","display:none;");
                $("#uploadingKycMsg").attr("style","display:block;padding-top:15px;");

                $.ajaxFileUpload({
                    url: "/uploadKycDocument/" + _fileElementId + "/" + _fileTypeId + "/" + $("#personId").val(),
                    secureuri: false,
                    fileElementId: _fileElementId,
                    dataType: 'JSON',
                    ppost: {
                        'documentTypeId': _fileTypeId,
                        'documentName': _fileElementId
                    },
                    beforeSend: function () {
                        $("#uploadKycDocument").unbind('click');
                    },
                    complete: function () {
                        $("#uploadKycDocument").bind('click');
                    },
                    success: function (data) {
                        $("#uploadKycDocument").bind('click');
                        data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;">', '').replace("</pre>", "");
                        data = data.replace('<pre>', '');
                        data = JSON.parse(JSON.stringify(data));
                        if (!isNullOrEmpty(data)) {
                            if ( 200 == data.status) {
                                displayResponse(data.response, true);
                                $("div#uploadPassport").remove();
                            }else{ displayResponse(data.response, false);}
                        }
                    }
                });
            }
        }
    }
}());