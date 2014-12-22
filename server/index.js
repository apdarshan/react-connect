var app = require('express')();
var http = require('http').Server(app);
var md5 = require('MD5');
var io = require('socket.io')(http);

var PORT = "3003";

var users = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('login', function(email){
    
    var userObj = _addUser2List(email, socket);

    /*to sender*/
    io.emit('loggedin', userObj);

    /*to everyone except sender*/
    socket.broadcast.emit('new user login', userObj);

  });

  socket.on('logout', function(email){
    _removeUserFromList(email);
  });

});

function _addUser2List(email, socket) {
  var userObj = _getUserObj(email, socket);
  users.push(userObj);

  console.log("Remaining users: ", users);
  return userObj;
}

function _removeUserFromList(email){
  users = users.filter(function(user){
    return user.email !== email;
  });
  
  console.log("Remaining users: ", users);
}


function _getUserObj(email, socket) {

  console.log("Logged in Socket", socket.id);

  var gravatarImg = "http://www.gravatar.com/avatar/" + md5(email),
      username = email.split("@")[0];

  return {username: username, email: email, gravatar: gravatarImg, socketID: socket.id}
}

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});
