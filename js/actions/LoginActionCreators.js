
var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var LoginWebAPIUtils = require('../utils/LoginWebAPIUtils');
var MessageStore = require('../stores/MessageStore');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  login: function(email) {
    LoginWebAPIUtils.login(email, this.loginSuccess, this.loginError);
  },

  logout: function() {
  	LoginWebAPIUtils.logout().then(function(){
  		ChatAppDispatcher.handleViewAction({
	      type: ActionTypes.LOGOUT_USER
	    });
  	}, function() {
  		console.log("Error logout");
  	});
  },

  loginSuccess: function(user) {
  	ChatAppDispatcher.handleViewAction({
      type: ActionTypes.LOGIN_USER,
      user: user
    });
  },

  loginError: function(err) {
  	console.log(err);
  }
};
