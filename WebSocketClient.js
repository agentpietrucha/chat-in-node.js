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
// var chattingUsers = document.querySelectorAll('.chattingUsers');

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
	nameMessageMapping.add(textInput.value, recipient, 'outcoming');
	textInput.value = '';
}

var recipients = [];
var costam = true;
chattingUsers.addEventListener('click', function(e){
	if(e.target.tagName !== 'P') {return;}
	recipient = e.target.innerText;
	sendJSON('toWho', recipient, null);
	user.innerHTML = recipient;
	if(nameMessageMapping.get(recipient) === undefined){
		clearTextArea.clear();
	} else{
		console.log('WFWEWVDAGARARVAWR');
		clearTextArea.clearAndPaste(recipient);
	}
});
activeUsers.addEventListener('click', function(e){
	if (e.target.tagName !== 'LI') {return;}
	if (e.target.innerText === name) {return;}
	recipient = e.target.innerText;
	// if (recipients.indexOf(recipient) !== -1) { return; }
	// recipients.push(recipient);
	sendJSON('toWho', recipient, null);
	user.innerHTML = recipient;
	addRecipient(recipient);
	if(nameMessageMapping.get(recipient) === undefined){
		clearTextArea.clear();
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
		console.log("activeUsers", data.message);
		for(var i = 0; i < data.message.length; i++){
			createAndInsertElement('li', null, data.message[i], activeUsers);
		}
	}
	if(data.type === 'userError'){
		createAndInsertElement('h1', null, data.message, body);
	}
	if(data.type === 'message'){
		updateScroll();
		recipient = data.fromWho;
		nameMessageMapping.add(data.message, recipient, 'incoming');
		createAndInsertElement('p', 'left', data.message, textArea);
		console.log('Message from user: ' + data.message);
		sendJSON('toWho', recipient, null);
		if(recipient !== user.innerHTML){
			if(nameMessageMapping.get(recipient) !== undefined){
				clearTextArea.clear();
			}
		}
		user.innerHTML = recipient;
		addRecipient(recipient);
	}
}

function addRecipient(recipient) {
	if (recipients.indexOf(recipient) === -1){
		recipients.push(recipient);
		createAndInsertElement('p', null, recipient, chattingUsers);
	}
}

connection.onerror = function(error){
	console.log('ERROR', error);
}
var stopper = true;
var nameMessageMapping = (function(){
	var mapping = {};
	// {karol: {
	// 	recipient = ola,
	// 	type: ccc
	// 	message: [czesc]
	// }}
	// {
	// 	marcysia: [
	// 		{type: "recived", data: "czesc kochanie"},
	// 		{type: "sent", data: "teskni;em za toba"}
	// 	],
	// 	ola: [],
	// 	berni: []
	// }
	// var messages =ccc.get(marcysia);
	// for (var i = messages.length - 1; i >= 0; i--) {
	// 	messages[i].type
	// 	messages[i].data
	// };
	// mapping[name] = new Object;
	return{
		add: function(message, recipient, type){
			if (mapping[recipient] === undefined) {
				mapping[recipient] = [];
			}
			mapping[recipient].push({type: type, message: message})
			console.log('MAPPING', mapping);
		},
		get: function(name){
			return mapping.name;
			// return localStorage.getItem('name');
		}
		// setInStorage: function(name){
		// 	// localStorage.clear();
		// 	// localStorage.setItem(name + recipient, mapping[name]);
		// },
		// getStorage: function(){
		// 	// localStorage.getItem(name + recipient);
		// }
	}
}());
function createAndInsertElement(element, clss, message, where){
	var element = document.createElement(element);
	element.classList.add(clss);
	element.innerHTML = message;
	where.appendChild(element);
}
// function clearTextArea(recipient){
// 	while(textArea.firstChild){
// 		textArea.removeChild(textArea.firstChild);
// 	}
// 	var x = nameMessageMapping.get(recipient);
// 	console.log(x.length);
// 	// for(var i = 0; i < name.length; i++){
// 	// 	if(name[i].type === 'incoming'){
// 	// 		createAndInsertElement('p', 'left', name[i].message, textArea);
// 	// 	} else if(name[i].type === 'outcoming'){
// 	// 		createAndInsertElement('p', 'right', name[i].messages, textArea);
// 	// 	}
// 	// }
// }
var clearTextArea = (function(){
	return{
		clear: function(){
			while(textArea.firstChild){
				textArea.removeChild(textArea.firstChild);
			}
		},
		clearAndPaste: function(recipient){
			clearTextArea.clear();
			var x = nameMessageMapping.get(recipient);
			console.log('LENGTH!!!!!!!!!:::::::::::', x.length);
			for(var i = 0; i < x	.length; i++){
				if(x[i].type === 'incoming'){
					createAndInsertElement('p', 'left', x[i].message, textArea);
				} else if(x[i].type === 'outcoming'){
					createAndInsertElement('p', 'right', x[i].messages, textArea);
				}
			}

		}
	}
}());