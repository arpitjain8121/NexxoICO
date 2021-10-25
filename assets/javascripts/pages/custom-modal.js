$(document).ready(function() {
    $('#profilePhotoModal').hide();
});

    $(".profile-photo-dropzone").dropzone({
    url: "/uploadPersonDocument/2/" + $("#personId").val(),
    error: function (file, response) {
        console.log("Erro");
        console.log(response);
    },
    success: function (file, response) {
        console.log("Sucesso");
        console.log(response);
        closeProfilePhotoModal();
        getpersondetails();
    },
    complete: function (file) {
        console.log("Complete");
    }
})

function showUploadProfilePhotoModal() {
    $('#profilePhotoModal').show();
}

function closeProfilePhotoModal() {
    $('#profilePhotoModal').hide();
}