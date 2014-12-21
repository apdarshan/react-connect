
var StorageUtils = require('./StorageUtils'),
    SocketServerUtils = require('./SocketServerUtils');

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
      return Promise.all([StorageUtils.setExtStorage("user", null), StorageUtils.setExtStorage("messages", null)]);
    }, function(er){
      console.log(er);
    });
  }

};
