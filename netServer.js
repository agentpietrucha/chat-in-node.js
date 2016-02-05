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
	socketWrite(socket, 'gimmie you nick nigga');

	socket.on('data', function(chunk){
		var data = trimNull(removeNewLines(chunk.toString()).trim());

		if(!hasName){
			if(namesList.indexOf(data) !== -1){
				socketWrite(socket, 'choose another name');
				return;
			}
			name = data.trim();
			// socket.write('active users: ' + namesList);
			// writeToThisOne(socket, 'active users: ' + namesList);
			writeToThisOne(socketWrite(socket, 'active users: ' + namesList))
			socketWrite(socket, 'Hi, ' + name);
			namesList.push(name);
			hasName = true;
		}

		console.log('client:' + name + ' ' + data);
		var message = name + ': ' + data;
		if(numMessagesFromClient === 0){
			message = name + ' ' + 'joined';
		}
		writeAll(message, socket);
		numMessagesFromClient += 1;
		// console.log('DATA FOR ' + name + ': ' + numMessagesFromClient);
		// if(data !== name){
		// chatHistory.push(data);
		// }
		chatHistory.push(name + ': ' + data);
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
			sockets[i].write(message + '\n');				
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

function writeToThisOne(thisone, ms){
	for(var i = 0; i < sockets.length; i++){
		if(sockets[i] === thisone){
			sockets[i].write(ms);
		} 
	}
}

function socketWrite(socket, message){
	socket.write(message + '\n');
}