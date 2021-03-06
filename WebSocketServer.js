const WebSocketServer = require('websocket').server;
const http = require('http');

const fs = require('fs');
var sockets = [];
var nameList = [];
var socketsToWriteTo = [];

var chatHistory = (function(){
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

var nameSocketMapping = (function(){
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

var server = http.createServer(function(req, res){
	console.log('http connected');
	var url = req.url;
	if(url === '/'){
		url = '/html.html';
	}
	try {
	res.write(getPage('/home/agentpietrucha/node/chat' + url));
	} catch (e) {

	}  
	res.end();
});
server.listen(8081)

function getPage(path){
	return fs.readFileSync(path).toString();
}

const wss = new WebSocketServer({
	httpServer: server,
});

wss.on('request', function(request) {
	var socket = request.accept('chat-protocol', request.origin);
	sockets.push(socket);
	sendJSON('activeUsersList', sockets, nameList);
	var name = '';
	var hasName = false;
	var asked = false;
	var numMessagesFromClient = 0;
	var personToSend;
	console.log('number of sockets: ' + sockets.length);
	console.log('WS connected');
	
	socket.on('message', function(data){
		var data = JSON.parse(data.utf8Data);
		if(data.type === 'nickname'){
			if(nameList.indexOf(data.name) !== -1){
				sendJSON('userError', [socket], 'Choose another name');
				return;
			}
			name = data.name;
			nameList.push(name);
			nameSocketMapping.add(name, socket);
			console.log('NAME SET TO: ' + name);
			console.log('NAMELIST: ' + nameList + '\n');
		}
		sendJSON('activeUsersList', sockets, nameList);
		console.log('activeUsers: ', nameList + '\n');
		if(data.type === 'toWho'){
			if(nameList.indexOf(data.name) === -1 || data.name === name){
				sendJSON('userError', [socket], 'user not found');
				return;
			} else{
				personToSend = data.name;
				console.log('PERSON SET');
			}
		}

		if (data.type === 'message'){
			console.log('MESSAGE FROM: ' + name + ': ' + data);
			sendJSON('message', [nameSocketMapping.get(personToSend)], data.message);
		}
	});
	socket.on('close', function(){
		sockets.splice(sockets.indexOf(socket), 1);
		nameList.splice(nameList.indexOf(name), 1);
		console.log(name + 'left conversation');
		sendJSON('activeUsersList', sockets, nameList);
	});
});
function sendJSON(type, sockets, message){
	var out = {
		type: type,
		message: message
	}
	for (var i = sockets.length - 1; i >= 0; i--) {
		var socket = sockets[i];
		socket.sendUTF(JSON.stringify(out));
	}
}
function trimNull(what) {
	var index = what.indexOf('\0');
	if (index > -1) {
		return what.substr(0, index);
	}
	return what;
}
function removeNewLines(str){
		return str.replace(/(\r\n|\n|\r)/gm,'');
	}