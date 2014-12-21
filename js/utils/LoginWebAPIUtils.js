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

var StorageUtils = require('./StorageUtils');

// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.

module.exports = {

  login: function(email, success, error) {
    // ajax to server

    // simulate success callback
    /*setTimeout(function() {
      var user = {email: email, gravatar: "http://www.gravatar.com/avatar/a7a6e27ed5d06642cb677dafa51f67bf"};
      StorageUtils.setStorage("user", user);
      success(user);
    }, 2000);*/

    var user = {email: email, gravatar: "http://www.gravatar.com/avatar/a7a6e27ed5d06642cb677dafa51f67bf"};
    StorageUtils.setExtStorage("user", user).then(function(){
      success(user);
    }, function(){
      error();
    });
  },

  logout: function() {
    /*TODO: get user data & inform server as well*/
    return StorageUtils.setExtStorage("user", null);
  }

};
