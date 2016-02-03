var net = require('net');

var sockets = [];
var namesList = [];

function writeAll (message) {
	for(var i = 0; i < sockets.length; i++){
		sockets[i].write(message);
	}
}

var server = net.createServer(function(socket){
	var hasNickname = false;
	var numMessagesFromClient = 0;
	var name = '';

	sockets.push(socket);
	console.log('number of sockets: ' + sockets.length);

	function removeWhitespace(str){
		return str.replace(/(\r\n|\n|\r)/gm,"");
	}
	socket.write('gimmie you nick nigga');

	socket.on('data', function(chunk){
		var data = removeWhitespace(chunk.toString());

		while(!hasNickname) {
			for(var i = 0; i < namesList.length; i++){
				if (namesList[i] === data) {
					socket.write('choose another name');
					return;
				}
			}
			hasNickname = true;
			name = data;
			namesList.push(name);
			socket.write('Hi, ' + name );
		}
		console.log('client:' + name + ' ' + data);
		var message = name + ': ' + data;
		if(numMessagesFromClient === 0){
			message = name + ' ' + 'joined';
		}
		writeAll(message);
		numMessagesFromClient += 1;
	})
	socket.on('end', function(){
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
		for(var i = 0; i < sockets.length; i++){
		sockets[i].write(name + ' left the conversation');
		}
		console.log(name + ' left the conversation');
	})
})

server.listen(8080);