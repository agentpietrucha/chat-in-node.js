const net = require('net');
// var address = process.argv[2];
var number = 0;
var name = '';

const client = net.connect({port: 8080/*, host: address*/}, function() {
	
	type(client);
});

client.on('error', function(error){
	if(error){
		console.log("Can't connect to the server. Please, check if provided IP address is correct u fuckin nigga!");
	} else{
		console.log('connected. Please enjoy');
	}
})
client.on('data', function(data){
	console.log( data.toString());
})
function type(where){
var stdin = process.openStdin();
	stdin.addListener('data', function(data){
		where.write(data.toString());
	});
}