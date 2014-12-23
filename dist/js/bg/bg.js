(function(){

	var CHAT_SOCKET_DOMAIN = "http://localhost:3003";
	var _socket;

	function _connectSocket() {
		_socket = io.connect(CHAT_SOCKET_DOMAIN);
		return _socket;
	}

	_connectSocket();


	function _includeContentScript(){

		return new Promise(function(resolve, reject) {
			chrome.tabs.insertCSS({
				file: "css/cs/animate.css"
			},function(){
		  		chrome.tabs.insertCSS({
					file: "css/cs/main.css"
				},function(){
			  		console.log("Content CSS Loaded");
			  		chrome.tabs.executeScript({
						file: "js/cs/content_script.js"
				  	}, function(){
				  		console.log("Content Script Included");
				  		resolve();
				  	});
			  	});
		  	});
		});
	}


	function _sendMessage2ContentScript(payload) {
		_includeContentScript().then(function(){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, payload, function(response) {
			   		//console.log("RESPONSE From CS:", response.farewell);
				});
			});
		});
	}

	_socket.on("new user login", function(user){
		var payload = {type: "login-toaster", data: user};
		_sendMessage2ContentScript(payload);
	});

	_socket.on("user logged out", function(user){
		var payload = {type: "logout-toaster", data: user};
		_sendMessage2ContentScript(payload);
	});

	_socket.on("new message", function(data){
		var payload = {type: "message-toaster", data: data};
		_sendMessage2ContentScript(payload);

	});


	window.Socket = {
		get: _connectSocket
	};


}());



