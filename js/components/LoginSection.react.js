var LoginActionCreators = require('../actions/LoginActionCreators');
var React = require('react');
var MUI = require('material-ui');
var ENTER_KEY_CODE = 13;

var LoginSection = React.createClass({

  /*getInitialState: function() {
    //return getStateFromStores();
  },*/

  componentDidMount: function() {
    /*ThreadStore.addChangeListener(this._onChange);
    UnreadThreadStore.addChangeListener(this._onChange);*/
  },

  componentWillUnmount: function() {
    /*ThreadStore.removeChangeListener(this._onChange);
    UnreadThreadStore.removeChangeListener(this._onChange);*/
  },

  render: function() {
   
    return (
      <div id="login-section">
        <MUI.Icon className="login-icon" icon="communication-email" />
        <input id="login-email" type="text" placeholder="Enter email address" onKeyDown={this._onKeyDown}/>
        <MUI.RaisedButton label="Join" primary={true} onClick={this._login}/>
      </div>
    );
  },

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      this._login();
    }
  },

  _login: function() {
    var email = document.querySelector("#login-email").value.trim();
    if(email) {
      LoginActionCreators.login(email);
    }
  }

});

module.exports = LoginSection;
