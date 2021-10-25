//Plug-in function for the bootstrap version of the multiple email
$(function(){
    readyYoutube();
    function readyYoutube(){
        if((typeof YT !== "undefined") && YT && YT.Player){
            var player, playing = false;
            var playCount = 0
            player = new YT.Player('nexxo-video', {
                    height: '360',
                    width: '540',
                    playerVars: {autoplay:1, controls:0,showinfo:0, rel:0},
                    videoId: 'od_CUz40EDk',
                    events: {
                        'onStateChange': onPlayerStateChange,
                        'onReady': onReady
                    }
                });

                function onReady(event){
                }

                function onPlayerStateChange(event) {
                        console.log(event.data);
                        if(!playing) {
                            playCount = playCount + 1;
                            playing = true;
                        }
                        console.log("video ajax being sent");
                        if(event.data == 0) {
                            sendVideoWatchConfirmation( $('#personId').val());
                        }
                }

                function sendVideoWatchConfirmation(id){
                    console.log('sending video confirmation message')
                    $.ajax({
                       type: "GET",
                       url: "/videowatchconfirm/"+id,
                       success: function(result) {
                            window.location.href="/personKycDetail";
                       },
                       error: function(data) {
                            console.log(data.responseText);
                            window.location.href = '/logout';
                       }
                   });
                }
        }else{
            setTimeout(readyYoutube, 100);
        }
    }
});
