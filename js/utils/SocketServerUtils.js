var Config = require('./Config'),
	ChatConstants = require('../constants/ChatConstants');

var _socket;
module.exports = {
	init: function() {
		_socket =  Config.getBGSocket(); //same socket is shared. From bg page (TODO: reconnecting if socket failed )
	},
	login: function(email) {
		_socket.emit("login", email);

		return new Promise(function(resolve, reject){
			_socket.on("loggedin", function(userData){
				console.log("I loggedin and My details:", userData);
				resolve(userData);
			});
		});
	},

	logout: function(email) {
		_socket.emit("logout", email);
	},

	sendMsg: function(msg) {
		//no user found, blind resolve
		if(!msg.to) {
			return Promise.resolve(msg);
		}
		_socket.emit("chat message", msg);
		return new Promise(function(resolve, reject){
			_socket.on("message sent", function(msgRes){
				console.log("My msg sent:", msgRes);
				resolve(msgRes);
			});
		});
	},

	sendRequest: function(toEmail, from) {;
		_socket.emit("send request", {toEmail: toEmail, from: from});
		return new Promise(function(resolve, reject){
			_socket.on("request result", function(res){
				console.log("My request result:", res);
				resolve(res);
			});
		});
	}
}