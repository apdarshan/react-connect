var React = require('react');
var MUI = require('material-ui');

var ReactPropTypes = React.PropTypes;

var UserListItem = React.createClass({

  propTypes: {
    user: ReactPropTypes.object
  },

  render: function() {
    var user = this.props.user;
    return (
      <li className="user-list-item">
        <div className="user-gravatar middle" title={user.email}>
          <img src={user.gravatar}/> 
          <h5 className="user-author-name">{user.username}</h5>
        </div>
        <MUI.RaisedButton label="Send Request" onClick={this._sendRequest} primary={true} />
      </li>
    );
  },

  _sendRequest: function() {

  }

});

module.exports = UserListItem;