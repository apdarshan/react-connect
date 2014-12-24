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

var ChatMessageActionCreators = require('../actions/ChatMessageActionCreators');
var React = require('react');

var ENTER_KEY_CODE = 13;

var MessageComposer = React.createClass({

  getInitialState: function() {
    return {text: ''};
  },

  render: function() {
    return (
      <div>
      <div className="google-microphone" onClick={this._listen}>
        <div className="shadow" ref="micShadow">
          <div className="gn">
            <div className="mc">
            </div>
          </div>
        </div>
      </div>
      <textarea
        className="message-composer"
        name="message"
        value={this.state.text}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
      />
      </div>
    );
  },

  _onChange: function(event, value) {
    this.setState({text: event.target.value});
  },

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      var text = this.state.text.trim();
      if (text) {
        ChatMessageActionCreators.createMessage(text);
      }
      this.setState({text: ''});
    }
  },

  _listen: function() {
    var ul = this.refs.micShadow.getDOMNode();
    ul.scrollTop = ul.classList.toggle("listening");
    ChatMessageActionCreators.listen();
  }

});

module.exports = MessageComposer;
