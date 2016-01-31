const net = require('net');

const client = net.connect({port: 8080}, function() {
	console.log('connected');
	// client.write('HEllo WORLD');
	type(client);
	
});

client.on('data', function(data){
	console.log('server: ' + data.toString());
	// if(data.toString() === 'gimmie you nick nigga'){
	// 	type(client);
	// }
})

function type(where){
var stdin = process.openStdin();
	stdin.addListener('data', function(data){
		where.write(data.toString());
	});
}