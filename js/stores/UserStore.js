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

  emitListChange: function() {
    this.emit(USERS_CHANGE_EVENT);
  },

  get: function() {
    return _user;
  },
  set: function(userObj){
    _user = userObj;
  },

  setUsers: function(users) {
    _users = users;
  },

  getUsers: function() {
    return _users;
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
      UserStore.setUsers(action.users);
      UserStore.emitListChange();
      break;

    default:
      // do nothing
  }

});

module.exports = UserStore;
