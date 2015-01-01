var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var UserWebAPIUtils = require('../utils/UserWebAPIUtils');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  fetchAllUsers: function() {
    UserWebAPIUtils.getAllUsers().then(this._receiveFetchedUsers);
  },

  _receiveFetchedUsers: function(res) {
    ChatAppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_USERS_LIST,
      users: res.users,
      friends: res.friends
    });
  },

  receiveNewFriends: function(friends) {
  	ChatAppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_NEW_FRIENDS_LIST,
      friends: friends
    });
  }

};
