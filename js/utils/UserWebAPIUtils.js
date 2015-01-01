var Config = require('./Config'),
	StorageUtils = require('./StorageUtils'),
	UserActionCreators = require('../actions/UserActionCreators');

var _socket = Config.getBGSocket();
module.exports = {
	getAllUsers: function() {
		_socket.emit("getusers", {});

		return new Promise(function(resolve, reject) {
			_socket.on("users list", function(users) {
				/*Get friends from local*/
				StorageUtils.getExtStorage('friends').then(function(friends){
					resolve({users: users, friends: friends});
				});
			});
		});
	},

	init: function() {
		/*new friends listener*/
		Config.addBGListener("new friend", this._watchNewFriends);
	},

	_watchNewFriends: function(friends) {
		UserActionCreators.receiveNewFriends(friends);
	}
};