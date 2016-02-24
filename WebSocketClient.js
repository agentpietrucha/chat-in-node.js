const connection = new WebSocket('ws://192.168.0.19:8081', 'chat-protocol');
var body = document.querySelector('body');
var textInput = document.querySelector('#textInput');
var messageButton = document.querySelector('#messageButton');
var textArea = document.querySelector('.textArea');
var nickButton = document.querySelector('#nickButton');
var nicknameInput = document.querySelector('#nicknameInput');
var name = '';
// var toWhoButton = document.querySelector('#toWhoButton');
// var toWhoInput = document.querySelector('#toWhoInput');
var activeUsers = document.querySelector('.activeUsers');
var user = document.querySelector('.user');

activeUsers.addEventListener('click', function(e){
	console.log(e.target.innerText);
	recipient = e.target.innerText;
	sendJSON('toWho', recipient, null);
	user.innerHTML = recipient;
	document.querySelector('.inputContainer').style.display = 'inline-block';
});

function sendNick() {
	name = nicknameInput.value;
	sendJSON('nickname', name);
	console.log('NAME' + nicknameInput.value);
	nicknameInput.value = '';
	document.querySelector('.toWhoContainer').style.display = 'block';
}
function sendMessage(){
	sendJSON('message', recipient, textInput.value);
	createAndInsertElement('p', 'right', textInput.value, textArea);
	textInput.value = '';
}
// function sendToWho(){
// 	console.log("setting recipient", toWhoInput.value);
// 	recipient = toWhoInput.value;
// 	sendJSON('toWho', recipient, null);
// 	toWhoInput.value = '';
// 	user.innerHTML = toWhoInput.value;
// 	document.querySelector('.inputContainer').style.display = 'block';
// }
nickButton.addEventListener('click', function(){
	// connection.send(nicknameInput.value);
	sendNick();
});
nicknameInput.addEventListener('keydown', function(e){
	if(e.keyCode !== 13) { return; }
	sendNick();
});
messageButton.addEventListener('click', function(){
	// connection.send(textInput.value);
	sendMessage();
});
textInput.addEventListener('keydown', function(e){
	if(e.keyCode !== 13) { return; }
	sendMessage();
});
// toWhoButton.addEventListener('click', function(){
// 	sendToWho();
// });
// toWhoInput.addEventListener('keydown', function(e){
// 	if(e.keyCode !== 13) { return; }
// 	sendToWho();
// });

function sendJSON(type, name, message){
	var out = {
		type: type,
		name: name,
		message: message
	}
	connection.send(JSON.stringify(out));
}
connection.onmessage = function(e){
	var data = JSON.parse(e.data);
	console.log('message form server: ' + e.data);
	if(data.type === 'activeUsersList'){
		console.log('activeUsers: ', data.message);
		while(activeUsers.firstChild){
			activeUsers.removeChild(activeUsers.firstChild);
		}
		for(var i = 0; i < data.message.length; i++){
			createAndInsertElement('li', null, data.message[i], activeUsers);
		}
	}
	if(data.type === 'userError'){
		createAndInsertElement('h1', null, data.message, body);
	}
	if(data.type === 'message'){
		console.log('Message from user: ' + data.message);
		createAndInsertElement('p', 'left', data.message, textArea);
	}
}
function createAndInsertElement(element, clss, message, where){
	var element = document.createElement(element);
	element.classList.add(clss);
	element.innerHTML = message;
	where.appendChild(element);
}