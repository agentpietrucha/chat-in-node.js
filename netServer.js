var net = require('net');


var sockets = [];
var server = net.createServer(function(socket){
	sockets.push(socket);
	console.log('number of sockets: ' + sockets.length);

	socket.write('gimmie you nick nigga');


	socket.on('data', function(chunk){
		console.log('client' + sockets.indexOf(socket) + chunk.toString());
		for(var i = 0; i < sockets.length; i++){
			sockets[i].write(chunk.toString());
		}
	})
	socket.on('end', function(){
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
		console.log("KUNIEC " + index);
	})



	// socket.end();
})

server.listen(8080);

function type(){

}

