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
		_socket.emit("chat message", msg);
		return new Promise(function(resolve, reject){
			_socket.on("message sent", function(msgRes){
				console.log("My msg sent:", msgRes);
				resolve(msgRes);
			});
		});
	}
}