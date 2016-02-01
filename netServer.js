var net = require('net');

var sockets = [];

var server = net.createServer(function(socket){
	var number = 0;
	var x = 0;

	sockets.push(socket);
	var name = '';
	console.log('number of sockets: ' + sockets.length);

	function removeWhitespace(str){
		return str.replace(/(\r\n|\n|\r)/gm,"");
	}
	socket.write('gimmie you nick nigga');

	socket.on('data', function(chunk){
		var data = removeWhitespace(chunk.toString());
		if(number === 0){
			socket.write('Hi, ' + data );
			number += 1;
			name += data;
			/*if(data === name){
				console.log('this name is in use, choose another name');
			}*/
		}
		console.log('client:' + name + ' ' + data);
		for(var i = 0; i < sockets.length; i++){
			if(x === 0){
			sockets[i].write(name + ' ' + 'joined');
			x += 1;
			} else{
				sockets[i].write(name + ': ' + data);
			}
		}
	})
	socket.on('end', function(){
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
		for(var i = 0; i < sockets.length; i++){
		sockets[i].write(name + ' left the conversation');
		}
		console.log(name + ' left the conversation');
	})



	// socket.end();
})

server.listen(8080);

function type(){

}

