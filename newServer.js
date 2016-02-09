const net = require('net');

const sockets = [];
const namesList = [];

const chatHistory = (function(){
	var history = [];
	return{
		add: function(data){
			if(history.length === 20){
				history.splice(0, 1);
			}
			history.push(data);
		},
		get: function(){
			return history;
		}
	};
}());

const nameSocketMapping = (function(){
	var mapping = {};
	return {
		add: function(name, socket) {
			mapping[name] = socket;
		},
		get: function(name) {
			return mapping[name];
		}
	}
}());


var server = net.createServer(function(socket){
	var name = '';
	var person = '';
	var hasName = false;
	var asked = false;
	var socket = socket;
	var numMessagesFromClient = 0;

	sockets.push(socket);
	console.log('number of sockets: ' + sockets.length);

	function removeNewLines(str){
		return str.replace(/(\r\n|\n|\r)/gm,'');
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
			printActiveUsers(name);
			socketWrite(socket, 'Hi, ' + name);
			namesList.push(name);
			nameSocketMapping.add(name, socket);
			hasName = true;
			socketWrite(socket, 'to which person: ');
			return;
		}
		if(data === '--pau'){
			printActiveUsers(name);
			return;
		}
		if(!asked){
			if(nameSocketMapping.get(data) === undefined || nameSocketMapping.get(data) === socket){
				socketWrite(socket, 'This user wasn\'t find, try again');
				return;
			}
			socketWrite(socket, 'U r now chatting with: ' + data);
			socket = nameSocketMapping.get(data);
			person = data;
			asked = true;
		}
		console.log('client:' + name + ' ' + data);
		var message = name + ': ' + data;
		if(numMessagesFromClient === 0){
			message = name + ' ' + 'joined';
			chatHistory.add(name + ' joined');
		} else{
			chatHistory.add(name + ': ' + data);
		}
		socket.write(message + '\n');
		numMessagesFromClient += 1;
	});
	socket.on('end', function(){
		sockets.splice(sockets.indexOf(socket), 1);
		namesList.splice(namesList.indexOf(name), 1);
		socketWrite(nameSocketMapping.get(person), name + ' left the conversation');
		console.log(name + ' left the conversation');
	});
});

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

function printActiveUsers(toWho){
	socketWrite(nameSocketMapping.get(toWho), 'active users: ' + namesList);
}