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

var ChatServerActionCreators = require('../actions/ChatServerActionCreators'),
    UserStore = require('../stores/UserStore'),
    SocketServerUtils = require('./SocketServerUtils'),
    Config = require('./Config'),
    StorageUtils = require('./StorageUtils');

// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.

module.exports = {

  getAllMessages: function() {
    StorageUtils.getExtStorage('messages').then(function(rawMessages){
      ChatServerActionCreators.receiveAll(rawMessages);
    });

  },

  createMessage: function(message) {

    var createdMessage = this._getMessage(message);

    StorageUtils.getExtStorage('messages').then(function(rawMessages){
      rawMessages.push(createdMessage);
      StorageUtils.setExtStorage("messages", rawMessages).then(function() {
        SocketServerUtils.sendMsg(createdMessage).then(function(msgRes) {
          ChatServerActionCreators.receiveCreatedMessage(msgRes);
        });
      }, function(){
        console.log("Error saving file");
      });
    });

  },

  _getMessage: function(message) {
    var timestamp = Date.now();
    var id = 'm_' + timestamp;
    var threadID = message.threadID || ('t_' + Date.now());
    var createdMessage = {
      id: id,
      threadID: threadID,
      threadName: message.threadName,
      authorName: message.authorName,
      text: message.text,
      timestamp: timestamp,
      sender: Config.getUserSync()
    };
    return createdMessage;
  }

};
