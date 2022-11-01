var g_questionBlock = new Vue({
    el: '#main',
    data: {
	items:[],
    },

    methods:{
	
	loadQuestions: function(){
	    var url = "/feedback_list.php";
	    	    
	    $.getJSON(url,
		  function(resp){this.pushNewComments(resp)}.bind(this) )
		.always(
		    function(){
			setTimeout(function(){this.loadQuestions()}.bind(this), 2000);
		    }.bind(this)
		);
	},

	pushNewComments: function(r){
	    r.reverse();
	    //console.log(r);
	    var items = [];
	    
	    for(var i=0;i<r.length;i++){
		var obj = r[i];
		//console.log(obj);
		var item = {id:obj.id, addr:obj.addr};
		try{
		    item.info = JSON.parse(obj.raw);
		}catch(err){
		    continue;
		}
		items.push(item);
            }
	    
	    this.items = items;
	    // console.log(items);
	},
	


    }
    
});


// init
g_questionBlock.loadQuestions();
