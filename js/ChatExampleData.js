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

var StorageUtils = require('./utils/StorageUtils'),
    UserStore = require('./stores/UserStore');

module.exports = {

  getDefaultData: function() {

    var yourLabel = "You",
        currentUserName = (UserStore.get() && UserStore.get().username && UserStore.get().username.capitalize()) || "Me";
    return [{
        id: 'm_1',
        threadID: 't_1',
        threadName: 'Jing and '+ yourLabel,
        authorName: 'Me',
        text: 'Hey Jing, want to give a Flux talk at ForwardJS?',
        timestamp: Date.now() - 99999
      },
      {
        id: 'm_2',
        threadID: 't_1',
        threadName: 'Jing and ' + yourLabel,
        authorName: 'Me',
        text: 'Seems like a pretty cool conference.',
        timestamp: Date.now() - 89999
      },
      {
        id: 'm_3',
        threadID: 't_1',
        threadName: 'Jing and '+ yourLabel,
        authorName: 'Jing',
        text: 'Sounds good.  Will they be serving dessert?',
        timestamp: Date.now() - 79999
      }];
  },

  init: function() {

    return StorageUtils.getExtStorage("messages").then(function(data){
      console.log("STORED DATAAAA", data);
      if(data) {
        return data;
      } else {
        return this.getDefaultData();
      }
    }.bind(this));
  }

};
