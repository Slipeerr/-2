var ws;

var g_aleft = [];

var A_SIZE = 4096;
var g_zero_buf = new Float32Array(A_SIZE);

var need_buf = true;
var processor;

var context;
var source;


var audio_flag = false;

function turnAudio(){
    if(audio_flag){
	// stop
	$('#btnAudio').addClass('btn-light');
	$('#btnAudio').removeClass('btn-primary');
	audio_flag = false;
	//
	ws.close();
	processor.disconnect();
	context.close();
	processor = undefined;
	context = undefined;
	
    }else{
	// start
	$('#btnAudio').removeClass('btn-light');
	$('#btnAudio').addClass('btn-primary');
	
	
	initAudio();
	
	audio_flag = true;
    }


}

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
	//on_audio64(event.data);
	on_audio(event.data);
    }
    
}



function a_init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
      context = new AudioContext();//{sampleRate:44100});
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

function initAudio(){
    a_init();

    console.log(context);
    console.log('start');

    // read ip and port
    var url = window.location.href;
    var arr = url.split("/");
    var arr2 = arr[2].split(":");
    var host = arr2[0];
    var port = parseInt(arr2[1], 10)+1;
        
    connect_to_ws(host, port);

    startPlayAudio();
}



function info(){
    console.log(context);
}


function on_audio(audioData){
    
    new Response(audioData).arrayBuffer().then(function(z){
	var ar = new Float32Array(z);
	g_aleft.push(ar);
    });
}



function startPlayAudio() {
    var ctx = context;
    processor = ctx.createScriptProcessor(A_SIZE, 1, 1);
    
    processor.onaudioprocess = function(evt) {
	var outputBuffer = evt.outputBuffer;
        var outputA = outputBuffer.getChannelData(0);

	
	// set to zero 
	outputA.set(g_zero_buf, 0);

	
	if(need_buf){
	    if(g_aleft.length < 5){
		console.log('start skip');
		return;
	    }
	    need_buf = false;
	}

	
	if(g_aleft.length == 0){
	    console.log('skip...');
	    return;
	}
	
	var a_l;

	var chz = 4;
	if(g_aleft.length < 4)
	    chz = g_aleft.length;

	
	for(var i=0;i<chz;i++){
	    a_l = g_aleft.shift();
	    outputA.set(a_l, i*1024);
	}
	
		
  };
  processor.connect(ctx.destination);
}





