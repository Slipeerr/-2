var G_CONFIG = undefined;
var G_NO_SLEEP = new NoSleep();

function on_ready(){
   var ts = new Date().valueOf();
   $.getJSON('/config.js?ts=' + ts, function(r){
     G_CONFIG = r;
     $('#videoContainer').show();
     if(r.isTrial){
       $('#tOvrl').html('TRIAL VERSION');
     }
     //console.log(r);
  });

    setTimeout( function(){ $('#sideSubBar').slideUp();}, 3000);
   //startPlay();

}


function pressStart(){
    console.log('press Start');

    var url = window.location.href;
    var arr = url.split("/");
    var arr2 = arr[2].split(":");
    var host = arr2[0];
    var port = parseInt(arr2[1], 10)+1;

    var baseurl = "ws://" + host + ":" + port ;
    $('#play_button').hide();
    $('#poster_img').attr('src', '/img/POSTER_WAIT.png');
    startPlay(baseurl);

    $('#myPoster').fadeOut(7000);

    cmd_connect(baseurl);
    //setTimeout( function(){ $('#sideSubBar').slideUp();}, 3000);

    G_NO_SLEEP.enable();
}


var g_player;


function onUnlocked () {
    // console.log('unlock video audio: ' + url)
    g_player.volume = 1
    document.removeEventListener('touchstart', onTouchStart)
}

function onTouchStart () {
    g_player.audioOut.unlock(onUnlocked)
    document.removeEventListener('touchstart', onTouchStart)
}

function startPlay(baseurl){
    console.log('start Play');

    // read ip and port
    var canvas = document.getElementById('video-canvas');


    g_player = new JSMpeg.Player(baseurl + '/readvideo', {canvas: canvas, autoplay:false, maxAudioLag:G_CONFIG.maxAudioLag, audioBufferSize:4*512*1024});

    // try to unlock immediately
    g_player.audioOut.unlock(onUnlocked);
    // try to unlock by touchstart event
    document.addEventListener('touchstart', onTouchStart, false);

}




function toggleSideSbar(){
    $('#sideSubBar').slideToggle();
}


function open_question_modal(){
    $('#dlg_form').show();
    $('#dlg_error').hide();
    $('#dlg_success').hide();

    $('#send_btn').prop('disabled', false);

    $('#questionModal').modal({});
}


function pack_question_form(){
    var obj = {name: $('#username').val(), msg: $('#message').val()};
    var res = JSON.stringify(obj);
    console.log(res);

    return res;
}


function send_message(){
    $('#send_btn').prop('disabled', true);
    $('#dlg_error').hide();

    var data = {raw:pack_question_form()};

    console.log(data);
    $.get('/feedback.php', data,
	  function(r){
	      $('#dlg_form').hide();
	      $('#message').val('');
	      $('#dlg_success').show();
	  }).fail(
	  function(){ $('#dlg_error').show();
			  $('#send_btn').prop('disabled', false);
			} );

}


function to_full_screen(id){
    var elem;

    if(!id)
	elem = document.documentElement;
    else
	elem = document.getElementById(id);

    if (elem.requestFullscreen) {
	elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
	elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
	elem.msRequestFullscreen();
    } else {
	alert('not supported');
    }
};


function is_allow_full_screen(id){
    var elem;

    if(!id)
	elem = document.documentElement;
    else
	elem = document.getElementById(id);

    if (elem.requestFullscreen) {
	return true;
    } else if (elem.mozRequestFullScreen) { /* Firefox */
	return true;
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	return true;
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
	return true;
    }

    return false;
}
