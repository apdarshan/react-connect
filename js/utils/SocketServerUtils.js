var Config = require('./Config'),
	ChatConstants = require('../constants/ChatConstants');

var _socket;
module.exports = {
	init: function() {
		if(!Config.getBGPage()) {
			alert("Socket Connection Error");
		}
		_socket =  Config.getBGPage()._socket; //same socket is shared. From bg page
		//this._listenForEnvents();
	},
	login: function(email){
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

	/*_listenForEvents: function() {

	}*/
}