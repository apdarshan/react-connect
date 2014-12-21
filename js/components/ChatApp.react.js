var MessageSection = require('./MessageSection.react');
var React = require('react');
var UserStore = require('../stores/UserStore');
var ThreadSection = require('./ThreadSection.react');
var LoginSection = require('./LoginSection.react');
var LoginActionCreators = require('../actions/LoginActionCreators');
var Config = require('../utils/Config');
var MUI = require('material-ui');

var _isFirstTimeUser = true;

var ChatApp = React.createClass({
  
  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    this._onChange();
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
  	Config.isFirstTimeUser().then(function(res){
    	_isFirstTimeUser = res;
	  	/*triggers & re-render*/
	  	this.forceUpdate();
    }.bind(this));
  },

  render: function() {
  	var landing;

  	if(_isFirstTimeUser) {
  		landing = <LoginSection />;
  	} else {
	  	landing = <div>
	  		<MUI.FlatButton className="right-align" label="Logout" primary={true} onClick={this._onClick}/>
	  		<ThreadSection />
	  		<MessageSection />
	  	</div>;
  	}

    return (
      <div className="chatapp">
        {landing}
      </div>
    );
  },

  _onClick: function() {
      LoginActionCreators.logout();
  }

});

module.exports = ChatApp;
