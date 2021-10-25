jQuery(document).ajaxError(function(e, xhr, settings) {
    console.log("Error in ")
    console.log(e);
    console.log(xhr);
    console.log(settings);
    try{
        var o= $.parseJSON(xhr.responseText);
        if (o && typeof o === "object" && o !== null) {
            if(o.action==="logout" && o.status==="399")
                window.location.href="/logout";
        }
    }
    catch(e){
        console.log(e);
    }
    console.log("error here");
});
