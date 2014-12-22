var LoginActionCreators = require('../actions/LoginActionCreators');
var React = require('react');
var MUI = require('material-ui');
var RaisedButton = MUI.RaisedButton;
var Paper = MUI.Paper;

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
        <input id="login-email" type="text" placeholder="Enter email address"/>
        <RaisedButton label="Join" primary={true} onClick={this._onClick}/>
      </div>
    );
  },

  _onClick: function() {
    var email = document.querySelector("#login-email").value.trim();
    if(email) {
      LoginActionCreators.login(email);
    }
  }

});

module.exports = LoginSection;
