var MessageSection = require('./MessageSection.react');
var React = require('react');
var UserStore = require('../stores/UserStore');
var MessageStore = require('../stores/MessageStore');
var UsersSection = require('./UsersSection.react');
var ThreadSection = require('./ThreadSection.react');
var LoginSection = require('./LoginSection.react');
var LoginActionCreators = require('../actions/LoginActionCreators');
var UserActionCreators = require('../actions/UserActionCreators');
var Config = require('../utils/Config');
var MUI = require('material-ui');

var _isFirstTimeUser = true, _messageView = true;

var ChatApp = React.createClass({
  
  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    MessageStore.addChangeListener(this._onChange);
    UserStore.addUsersListChangeListener(this._onUsersChange);
    this._onChange();
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
    MessageStore.removeChangeListener(this._onChange);
    UserStore.removeUsersListChangeListener(this._onUsersChange);
  },

  _onChange: function() {
  	Config.getUser().then(function(res){
    	_isFirstTimeUser = !res;
	  	/*triggers & re-render*/
	  	this.forceUpdate();
    }.bind(this));
  },

  _onUsersChange: function() {
    this.setState({menuicon: {type: "communication-forum"}}); //triggers render
  },

  _getDefaultState: function() {
    return {menuicon: {type: "communication-contacts"}};
  },

  getInitialState: function() {
    return this._getDefaultState();
  },

  render: function() {
  	var landing, mainSection;

  	if(_isFirstTimeUser) {
  		landing = <LoginSection />;
  	} else {
      if(_messageView) {
        mainSection = <div>
          <ThreadSection />
          <MessageSection />
        </div>;
      } else {
        mainSection =  <UsersSection/>
      }

	  	landing = <div>
        <MUI.FloatingActionButton className="users-list left-align" icon={this.state.menuicon.type} onClick={this._toggleUsers} mini={true}/>
	  		<MUI.FlatButton className="right-align logoutBtn" label="Logout" primary={true} onClick={this._logout}/>
	  		{mainSection}
	  	</div>;
  	}

    return (
      <div className="chatapp">
        {landing}
      </div>
    );
  },

  _logout: function() {
      _messageView = true;
      LoginActionCreators.logout();
  },

  _toggleUsers: function() {
      if(_messageView) {
        _messageView = false;
        UserActionCreators.fetchAllUsers();
      } else {
        _messageView = true; // back to main section
        this.setState(this._getDefaultState());
      }
  }

});

module.exports = ChatApp;
