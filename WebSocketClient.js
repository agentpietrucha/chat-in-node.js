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
var chattingUsers = document.querySelector('.chattingUsers');

function updateScroll(){
	textArea.scrollTop = textArea.scrollHeight;
}
function sendNick() {
	name = nicknameInput.value;
	sendJSON('nickname', name);
	console.log('NAME' + nicknameInput.value);
	nicknameInput.value = '';
	nicknameInput.placeholder = 'Hi, ' + name;
}
function sendMessage(){
	sendJSON('message', recipient, textInput.value);
	createAndInsertElement('p', 'right', textInput.value, textArea);
	textArea.scrollTop = textArea.scrollHeight;
	nameMessageMapping.add(name, textInput.value, recipient, 'outcoming');
	textInput.value = '';
}
var recipients = [];
var costam = true;
activeUsers.addEventListener('click', function(e){
	recipient = e.target.innerText;
	recipients.push(recipient);
	while(textArea.firstChild){
		textArea.removeChild(textArea.firstChild);
	}
	sendJSON('toWho', recipient, null);
	if(recipient !== name){
		// while(costam){
		user.innerHTML = recipient;
		// for(var i = 0; i < recipients.length; i++){
		// 	if(recipients[i] === document.querySelectorAll('.chattingUsers p')){
		// 		return;
		// 	} else{
		 		createAndInsertElement('p', null, recipient, chattingUsers);	
		// 	}
		// }
			// costam = false;
		// }
	}
	document.querySelector('.inputContainer').style.display = 'inline-block';
});
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
	updateScroll();
	var data = JSON.parse(e.data);
	if(data.type === 'activeUsersList'){
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
		recipient = data.fromWho;
		nameMessageMapping.add(recipient, data.message, recipient, 'income');
		// nameMessageMapping.setInStorage(recipient);
		console.log('LOCALSTORAGE', localStorage.getItem('messages'));
		console.log('Message from user: ' + data.message);
		sendJSON('toWho', recipient, null);
		createAndInsertElement('p', 'left', data.message, textArea);
		while(costam){
			user.innerHTML = recipient;
			createAndInsertElement('p', null, recipient, chattingUsers);
			costam = false;
		}
	}
}
connection.onerror = function(error){
	console.log('ERROR', error);
}
var nameMessageMapping = (function(){
	var mapping = {};
	return{
		add: function(name, message, recipient, type){
			if(mapping[name] === undefined){
				console.log('first if in mapping');
				mapping[name] = new Object;
				mapping[name].type = type;
				mapping[name].recipient = recipient;
				mapping[name].message = new Array;
				mapping[name].message.push(message);
			} else{
				console.log('second if in mapping');
				mapping[name].message.push(message);
			}
			console.log(mapping);
		},
		get: function(name){
			return localStorage.getItem('name');
		},
		setInStorage: function(name){
			localStorage.clear();
			localStorage.setItem(name + recipient, mapping[name]);
		},
		getStorage: function(){
			localStorage.getItem(name + recipient);
		}
	}
}());
function createAndInsertElement(element, clss, message, where){
	var element = document.createElement(element);
	element.classList.add(clss);
	element.innerHTML = message;
	where.appendChild(element);
}