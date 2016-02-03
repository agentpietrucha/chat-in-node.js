var net = require('net');

var sockets = [];
var namesList = [];
var chatHistory = [];


var server = net.createServer(function(socket){
	var name = '';
	var hasName = false;
	var numMessagesFromClient = 0;

	sockets.push(socket);
	console.log('number of sockets: ' + sockets.length);

	function removeNewLines(str){
		return str.replace(/(\r\n|\n|\r)/gm,"");
	}
	socket.write('gimmie you nick nigga');

	socket.on('data', function(chunk){
		var data = trimNull(removeNewLines(chunk.toString()).trim());

		if(!hasName){
			if(namesList.indexOf(data) !== -1){
				socket.write('choose another name');
				return;
			} else{
				name = data.trim();
				socket.write('active users: ' + namesList);
				namesList.push(name);
				socket.write('Hi, ' + name );
				hasName = true;
			}
		}

		console.log('client:' + name + ' ' + data);
		var message = name + ': ' + data;
		if(numMessagesFromClient === 0){
			message = name + ' ' + 'joined';
		}
		writeAll(message, socket);
		numMessagesFromClient += 1;
		// console.log('DATA FOR ' + name + ': ' + numMessagesFromClient);
		if(data !== name){
		chatHistory.push(data);
		}
		console.log(name + ': ' + chatHistory);
	})
	socket.on('end', function(){
		// var indexOfSocket = sockets.indexOf(socket);
		sockets.splice(sockets.indexOf(socket), 1);
		// var indexOfName = namesList.indexOf(name);
		namesList.splice(namesList.indexOf(name), 1);
		for(var i = 0; i < sockets.length; i++){
		sockets[i].write(name + ' left the conversation');
		}
		console.log(name + ' left the conversation');
	})
})

server.listen(8080);

function writeAll (message, socket) {
	for(var i = 0; i < sockets.length; i++){
		if(sockets[i] === socket){
			continue;
		} else{
			sockets[i].write(message);				
		}
	}
}

function trimNull(what) {
  var index = what.indexOf('\0');
  if (index > -1) {
    return what.substr(0, index);
  }
  return what;
}