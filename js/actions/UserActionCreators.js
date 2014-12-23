var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var UserWebAPIUtils = require('../utils/UserWebAPIUtils');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  fetchAllUsers: function() {
    UserWebAPIUtils.getAllUsers().then(this.receiveFetchedUsers);
  },

  receiveFetchedUsers: function(users) {
    ChatAppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_USERS_LIST,
      users: users
    });
  }

};
