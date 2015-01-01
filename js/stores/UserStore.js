/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change', USERS_CHANGE_EVENT = 'users change';

var _user = {};
var _users = []; // Logged in users
var _friends = [];

function _markAllInThreadRead(threadID) {
  /*for (var id in _messages) {
    if (_messages[id].threadID === threadID) {
      _messages[id].isRead = true;
    }
  }*/
}

var UserStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitListChange: function() {
    this.emit(USERS_CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addUsersListChangeListener: function(callback) {
    this.on(USERS_CHANGE_EVENT, callback);
  },
  
  removeUsersListChangeListener: function(callback) {
    this.removeListener(USERS_CHANGE_EVENT, callback);
  },

  get: function() {
    return _user;
  },
  
  set: function(userObj){
    _user = userObj;
  },

  _isAlreadyInFriendList: function(user) {
    return _friends.some(function(friend){
      return user.email === friend.email;
    });
  },

  _prepareUsers: function(users) {
    users.forEach(function(user){
      user.isFriend = this._isAlreadyInFriendList(user);
      user.isMyself = (user.email === _user.email);
    }.bind(this));

    return users;
  },

  setUsers: function(users) {
    _users = this._prepareUsers(users);
  },

  getUsers: function() {
    return _users;
  },

  setFriends: function(friends) {
    _friends = friends || [];
  },

  addAsFriend: function(friend) {
    users.forEach(function(user){
      user.isFriend = (user.email === friend.email);
    });
  }

});

UserStore.dispatchToken = ChatAppDispatcher.register(function(payload) {
  var action = payload.action;
  console.warn("UserStore  payload", payload);
  switch(action.type) {

    case ActionTypes.LOGIN_USER:
      //_markAllInThreadRead();
      UserStore.set(action.user);
      UserStore.emitChange();
      break;

    case ActionTypes.LOGOUT_USER:
      //_markAllInThreadRead();
      UserStore.emitChange();
      break;
    case ActionTypes.RECEIVE_USERS_LIST:
      UserStore.setFriends(action.friends);
      UserStore.setUsers(action.users);
      UserStore.emitListChange();
      break;

    case ActionTypes.RECEIVE_REQUEST_ACCEPTED:
      UserStore.addAsFriend(action.result.friend);
      UserStore.emitListChange();
      break;

    case ActionTypes.RECEIVE_NEW_FRIENDS_LIST:
      UserStore.setFriends(action.friends);
      UserStore.emitListChange();
      break;

    default:
      // do nothing
  }

});

module.exports = UserStore;
