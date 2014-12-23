var Config = require('./Config'),
	ChatConstants = require('../constants/ChatConstants');

var _socket = Config.getBGSocket();
module.exports = {
	getAllUsers: function() {
		_socket.emit("getusers", {});

		return new Promise(function(resolve, reject){
			_socket.on("users list", function(users){
				console.log("requested users:", users);
				resolve(users);
			});
		});
	}
}