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
    ChatExampleData = require('../ChatExampleData'),
    Config = require('./Config'),
    StorageUtils = require('./StorageUtils');


module.exports = {

  getAllMessages: function() {
    StorageUtils.getExtStorage('messages').then(function(rawMessages){
      if(rawMessages) {
        ChatServerActionCreators.receiveAll(rawMessages);
      } else {
        /*get default data*/
        var defaultData = ChatExampleData.getDefaultData();
        StorageUtils.setExtStorage("messages", defaultData).then(function(){
          ChatServerActionCreators.receiveAll(defaultData);
        });
      }
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

  sendRequest: function(toEmail, from) {
    SocketServerUtils.sendRequest(toEmail, from).then(function(res) {
        ChatServerActionCreators.receiveRequestResult(res);
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
