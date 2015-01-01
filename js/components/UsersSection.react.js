
//var MessageComposer = require('./MessageComposer.react');
var UserListItem = require('./UserListItem.react');
var UserStore = require('../stores/UserStore');
var React = require('react');


function getStateFromStores() {
  return {
    users: UserStore.getUsers()
  };
}

function getUserListItem(user) {
  return (
    <UserListItem
      user={user}
    />
  );
}

var UsersSection = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this._scrollToBottom();
    UserStore.addUsersListChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeUsersListChangeListener(this._onChange);
  },

  render: function() {
    var userListItems = this.state.users.map(getUserListItem);
    return (
      <div className="user-list-section">
        <h4 className="users-heading">Logged In Users</h4>
        <ul className="user-list" ref="usersList">
          {userListItems}
        </ul>
      </div>
    );
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    var ul = this.refs.usersList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  },

  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = UsersSection;
