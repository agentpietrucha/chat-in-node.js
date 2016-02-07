const net = require('net');
var address = process.argv[2];
var number = 0;
var name = '';

const client = net.connect({port: 8080, host: address}, function() {
	type(client);
});

client.on('error', function(error){
	if(error.code === 'EHOSTUNREACH'){
			console.log("Can't connect to the server. Please, check if provided IP address is correct u fuckin nigga!");	
	} else if(error.code === 'ECONNREFUSED'){
		console.log("It seems that, the server is still sleeping, after working very hard last nigh, in contrast to you, you piece of SHIT.")
	}
	console.log(error);
})
client.on('data', function(data){
	process.stdout.write( data.toString());
})

client.on('end', function(){
	console.log("Server had ended his work, and went sleep. Please, don't wake him up");
	client.end();
})
function type(where){
	var stdin = process.openStdin();
	stdin.addListener('data', function(data){
		where.write(data.toString() + '\n');
	});
}