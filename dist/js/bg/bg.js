(function(){

	var CHAT_SOCKET_DOMAIN = "http://localhost:3003";
	var _socket;


	/*MISC*/
	String.prototype.capitalize = function() {
		return this.slice(0,1).toUpperCase() + this.slice(1)
	};


	function _loginBack() {
		getUser().then(function(user){
			if(user) {
				_socket.emit("login back", user.email);
			}
		});
	}

	function _connectSocket() {
		_socket = io.connect(CHAT_SOCKET_DOMAIN);
		_loginBack();
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
			   		console.log("BG: RESPONSE From CS:", response);
				});
			});
		});
	}

	function getUser() {
		return new Promise(function(resolve, reject){
			chrome.storage.local.get("user", function(value) {
    			resolve(value["user"]);
    		});
		});
	}

	function checkInFriendsList(newFriend) {
		return new Promise(function(resolve, reject){
			chrome.storage.local.get("friends", function(value) {
				var isFound = value["friends"] && value["friends"].some(function(friend){
					return friend.email === newFriend.email;
				});
				if(!isFound) {
					resolve();
				}
			});
		});
	}

	/*To have same threadID for both users*/
	function _generateThreadID(user, friend, isMyRequest) {
		var id = 't_';
		if(isMyRequest) {
			id += user.username + '_' + friend.username;
		} else {
			id += friend.username + '_' + user.username;
		}
		return id;
	}

	function addThread(newFriend, isMyRequest) {
		/*Trick: creating a dummy msg, so that threads are created*/
		checkInFriendsList(newFriend).then(getUser).then(function(user) {
			var timestamp = Date.now();
			var id = 'm_' + timestamp;
		    var threadID = _generateThreadID(user, newFriend, isMyRequest);//('t_' + timestamp);
		    var startUpMsg = {
		      id: id,
		      threadID: threadID,
		      threadName: "You and " + newFriend.username.capitalize(),
		      authorName: "You are now connected with " + newFriend.username.capitalize() + " !! Start messaging...", //treating this message as info
		      text: "",
		      timestamp: timestamp,
		      sender: user,
		      to: newFriend
		    };
		    chrome.storage.local.get("messages", function(value) {
		    	var messages = value["messages"] || [];
		    	messages.push(startUpMsg);
		    	chrome.storage.local.set({"messages" :messages}, function() {
		    		addToFriendList(newFriend).then(function(friends){
		    			window.Message.emit("new friend", friends);
		    		});
		    	});
		    });
		});
	}

	function addToFriendList(newFriend) {
		return new Promise(function(resolve, reject) {
			chrome.storage.local.get("friends", function(value) {
		    	var friends = value["friends"] || [];
		    	friends.push(newFriend);
		    	chrome.storage.local.set({"friends" :friends}, function() {
		    		resolve(friends);
		    	});
    		});
		});
	}

	function updateBrowserActionIcon(from) {
		chrome.browserAction.setIcon({
            path: "images/unread.png"
        });
        /*Badge: firstletter of sender username*/
        chrome.browserAction.setBadgeText({ text: from.username.slice(0,1).toUpperCase() });
	}

	function saveMessage(data) {
		/*changing threadName*/
		data.msg.threadName = "You and " + data.from.username.capitalize();
		data.msg.authorName = data.from.username.capitalize();
		data.msg.to = JSON.parse(JSON.stringify(data.from)); //to send to other user next time

		chrome.storage.local.get("messages", function(value) {
	    	var messages = value["messages"];
	    	messages.push(data.msg);
	    	chrome.storage.local.set({"messages" :messages}, function() {
	    		updateBrowserActionIcon(data.from);
	    		/*notify popup*/
				window.Message.emit("new message", messages);
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

	_socket.on("new message", function(data) {
		var payload = {type: "message-toaster", data: data};
		_sendMessage2ContentScript(payload);
		saveMessage(data);
	});

	_socket.on("new request", function(data){
		var payload = {type: "request-toaster", from: data.from};
		_sendMessage2ContentScript(payload);
	});

	_socket.on("request result", function(res) {
		console.log("My request result:", res);
		if(res.action === "accept") {
			addThread(res.from, true);
		}
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    if(request && request.type === "request-toaster-action") {
	    	getUser().then(function(user){
	    		_socket.emit("reponse to request", {result: request.value, from: user});
	    		if(request.value.action === "accept") {
					addThread(request.value.friend);
				}
	    	});
	    }
	});

	window.Socket = {
		get: _connectSocket
	};

	window.Message = (function() {
		var listeners = {}, exportObj = {};
		exportObj = { 
			on: function(type, callback) {
				if(listeners[type]) {
					listeners[type].push(callback);
				} else {
					listeners[type] = [callback];
				}
			},
			emit: function(type, data) {
				if(listeners[type]) {
					listeners[type].forEach(function(cb){
						cb(data);
					});
				}
			}
		}
		return exportObj; 
	}());

	window.ChatMessage = {
		listenSpeech: function(success) {
			_sendMessage2ContentScript({type:"listen"});
			chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
			    if(request.data.msg) {
			    	success(request.data.msg);
				}
			});
		}
	};

}());



