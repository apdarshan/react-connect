var ChatConstants = require('../constants/ChatConstants');
var _socket;
module.exports = {
	init: function() {
		_socket = io.connect(ChatConstants.SOCKET.DOMAIN);
	},
	login: function(email){
		_socket.emit("login", email);

		return new Promise(function(resolve, reject){
			_socket.on("loggedin", function(userData){
				resolve(userData);
			});
		});
	},

	logout: function(email) {
		_socket.emit("logout", email);
	}
}