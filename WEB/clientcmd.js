var G_CMD_WS = undefined;
function cmd_connect(baseurl){
  G_CMD_WS = new WebSocket(baseurl + '/cmdchannel');
  G_CMD_WS.onopen = function(){
      console.log('cmd ws open 1');
  };

  G_CMD_WS.onmessage = messageHandler;

  //test123();
  // vote_open('txt', []);
  //test_quiz();
}

function messageHandler(event){
    var obj = JSON.parse(event.data);
    //console.log(obj);
    var cmd = obj.command;


    // Random Winner
    if(cmd == 'random_game_tick'){
	random_game_tick(obj.clr, obj.proc);
	return;
    }

    if(cmd == 'random_game_finish'){
	random_game_finish(obj.win_txt, obj.win_code, obj.lose_txt);
	return;
    }


    // Vote
    if(cmd == 'vote_start'){
	vote_open(obj.title, obj.options);
	return;
    }

    if(cmd == 'vote_stop'){
	vote_close();
	return;
    }


}

function sendToServer(cmd, obj){
    obj['command'] = cmd;
    G_CMD_WS.send(JSON.stringify(obj));
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


var g_i = 0;
var g_tmr ;
function test123(){
  //setInterval(function(){ cmd_showcolor(getRandomColor())}, 500);
    console.log('call test 123');
    g_tmr = setInterval(function(){
	showGame(getRandomColor(), g_i);
	g_i += 1;
	if(g_i == 10){
	    clearInterval(g_tmr);
	    finishGame('red', 'text', true);
	}

    },
		100);
}


// -------------------------------------------------------------//
//         RANDOM GAME MODE
// -------------------------------------------------------------//
var g_game_visible = false;
var g_win_code;

function random_game_tick(clr, proc){
    if(!g_game_visible){
	g_game_visible = true;
	g_win_code = undefined;
	$('#gameContent').html('');
	$('#gameProgress').css('width', '0%');
	$('#gameClose').hide();
	$('#gameProgressWrapper').show();
	$('#gameModal').modal({backdrop:'static'});
    }

    $('#gameModal').css("background-color", clr);
    $('#gameProgress').css('width', proc + '%');
}


function random_game_finish(win_txt, win_code, lose_txt){
    g_game_visible = false;
    $('#gameProgressWrapper').hide();

    if(win_code){
	// win
	g_win_code = win_code;
	$('#gameModal').css("background-color", 'yellow');
	$('#gameContent').html(win_txt + "<br/><b>code: " + win_code + "</b>");
    }else{
	// non-win
	$('#gameModal').css("background-color", 'rgb(96, 125, 139)');
	$('#gameContent').html(lose_txt);
    }
    $('#gameClose').show();

    // win - used only for show or not confirmation message
    console.log('random_game_finishs');
}


function random_game_close(){
    if(g_win_code){
	if(confirm('Are you sure ? Please remember the code.')){
	    $('#gameModal').modal('hide');
	}
    }else{
	$('#gameModal').modal('hide');
    }
}


function cmd_showcolor(clr){
    //console.log(clr);
    //$('#ovelayContentWrapper').css("background-color", clr);
    $('#overlayModal').css("background-color", clr);
}


// -------------------------------------------------------------//
//         VOTING MODE
// -------------------------------------------------------------//
function vote_open(title, options){
    console.log(options);
    $('#voteTitle').html(title);

    $('input[name="vote_result"]').prop('checked', false);

    for(var i=0;i<options.length;i++){
	_vote_handle_option(i+1, options[i]);
    }

    $('#voteModal').modal({backdrop:'static'});
}

function _vote_handle_option(num, txt){

  if(!txt){
    $('#vote_block_'+ num).hide();
    return;
  }
  $('#vote_option_'+ num).html(txt);
  $('#vote_block_'+ num).show();

}

function vote_submit(){
    var v = $('input[name ="vote_result"]:checked').val();

    if(!v){
	alert('Please select option');
	return;
    }


    sendToServer('vote_result', {result:v});

    vote_close();

    console.log(v);
}

function vote_close(){
    $('#voteModal').modal('hide');
}

// -------------------------------------------------------------//
//         QUIZ MODE
// -------------------------------------------------------------//
function test_quiz(){
  var opts = ['option 1', 'option 2', 'option 3', 'option 3'];
  quiz_open('What is your options ?', opts);
}

function quiz_open(title, options){
    //console.log(options);
    $('#quizTitle').html(title);

    $('input[name="quiz_result"]').prop('checked', false);

    for(var i=0;i<options.length;i++){
	     _quiz_handle_option(i+1, options[i]);
    }

    $('#quizModal').modal({backdrop:'static'});
}

function _quiz_handle_option(num, txt){

  if(!txt){
    $('#quiz_block_'+ num).hide();
    return;
  }
  $('#quiz_option_'+ num).html(txt);
  $('#quiz_block_'+ num).show();

}
