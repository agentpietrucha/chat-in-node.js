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
			writeToThisOne(socketWrite(socket, 'active users: ' + namesList));
			for(var i = 0; i < chatHistory.length; i++){
				writeToThisOne(socketWrite(socket, chatHistory[i]));
			}
			console.log(chatHistory);
			socketWrite(socket, 'Hi, ' + name);
			namesList.push(name);
			hasName = true;
		}

		console.log('client:' + name + ' ' + data);
		var message = name + ': ' + data;
		if(numMessagesFromClient === 0){
			message = name + ' ' + 'joined';
			chatHistory.push(name + ' joined');
		} else{
			chatHistory.push(name + ': ' + data);
		}
		if(chatHistory.length === 21){
			chatHistory.splice(0, 1);
		}
		writeAll(message, socket);
		numMessagesFromClient += 1;
		// chatHistory.push(name + ': ' + data);

	})
	socket.on('end', function(){
		// var indexOfSocket = sockets.indexOf(socket);
		sockets.splice(sockets.indexOf(socket), 1);
		// var indexOfName = namesList.indexOf(name);
		namesList.splice(namesList.indexOf(name), 1);
		for(var i = 0; i < sockets.length; i++){
		socketWrite(sockets[i], name + ' left the conversation')
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