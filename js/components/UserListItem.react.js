var React = require('react');
var ChatMessageActionCreators = require('../actions/ChatMessageActionCreators');
var MUI = require('material-ui');

var ReactPropTypes = React.PropTypes;

var UserListItem = React.createClass({

  propTypes: {
    user: ReactPropTypes.object
  },

  render: function() {
    var user = this.props.user,
        requestBtn;
    if(user.isMyself) {
      requestBtn = <MUI.FlatButton label="Me ;)" disabled={true} />;
    } else if(user.isFriend) {
      requestBtn = <MUI.RaisedButton label="Friended" disabled={true} />;
    } else {
      requestBtn = <MUI.RaisedButton className="send-request-btn" label="Send Request" onClick={this._sendRequest} primary={true} />;
    }
    return (
      <li className="user-list-item">
        <div className="user-gravatar middle" title={user.email}>
          <img src={user.gravatar}/> 
          <h5 className="user-author-name">{user.username}</h5>
        </div>
        {requestBtn}
      </li>
    );
  },

  _sendRequest: function() {
    ChatMessageActionCreators.sendRequest(this.props.user.email);
  }

});

module.exports = UserListItem;