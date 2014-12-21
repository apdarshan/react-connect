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

var StorageUtils = require('./StorageUtils'),
    SocketServerUtils = require('./SocketServerUtils');

// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.

module.exports = {

  login: function(email, success, error) {

    SocketServerUtils.login(email).then(function(data){
      StorageUtils.setExtStorage("user", data).then(function(){
        success(data);
      }, function(){
        error();
      });
    });

  },

  logout: function() {

    return StorageUtils.getExtStorage("user").then(function(user){
      console.log("User data", user);
      return SocketServerUtils.logout(user.email); //let server know
    }, function(er){
      console.log(er);
    }).then(function(){
      return StorageUtils.setExtStorage("user", null);
    }, function(er){
      console.log(er);
    });
  }

};
