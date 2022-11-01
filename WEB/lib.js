var ws;

function connect_to_ws(ip, port){
    ws = new WebSocket("ws://" + ip + ":" + port);

    ws.onopen = function(){
	console.log('ws open');
    };

    
    ws.onclose = function(event) {
	if (event.wasClean) {
	    console.log('ws connection closed');
	} else {
	    console.log('ws disconnected'); 
	}
	console.log('ws close: ' + event.code + ' reason: ' + event.reason);
    };

    
    ws.onmessage = function (event) {
	//console.log(event.data);
	on_data(event.data);
    }
    
}

var player;

function onUnlocked () {
	// console.log('unlock video audio: ' + url)
	player.volume = 1
	document.removeEventListener('touchstart', onTouchStart)
}

function onTouchStart () {
	player.audioOut.unlock(onUnlocked)
	document.removeEventListener('touchstart', onTouchStart)
}



function start(){
    //connect_to_ws('localhost', '9000');
    // read ip and port
    var url = window.location.href;
    var arr = url.split("/");
    var arr2 = arr[2].split(":");
    var host = arr2[0];
    var port = parseInt(arr2[1], 10)+1;
    
    var canvas = document.getElementById('video-canvas');
    var url = "ws://" + host + ":" + port ;//'ws://'+document.location.hostname+':8082/';
    //var url = 'ws://127.0.0.1:8081/';
    player = new JSMpeg.Player(url, {canvas: canvas});
	
	
	// try to unlock immediately
	player.audioOut.unlock(onUnlocked)
	// try to unlock by touchstart event
	document.addEventListener('touchstart', onTouchStart, false)
				
}

function on_data(d){
    console.log(d);
}
