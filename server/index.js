var app = require('express')();
var http = require('http').Server(app);
var md5 = require('MD5');
var pem = require('pem');
var io = require('socket.io')(http);
var https;

var PORT = "3003", SECURE_PORT = "3004";//"443";

pem.createCertificate({days:1, selfSigned:true}, function(err, keys) {
  https = require('https').Server({key: keys.serviceKey, cert: keys.certificate}, app);
  https.listen(SECURE_PORT, function(){
    console.log('listening https on *:' + SECURE_PORT);
  });
});

var users = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/contentframe.html', function(req, res){
  res.sendfile('contentframe.html');
});

app.get('/contentframe.js', function(req, res){
  res.sendfile('contentframe.js');
});

io.on('connection', function(socket){
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){

    var user = _getUserFromList(msg.sender.email); // not using socket id

    console.log('received message: ::::', msg, " From USer::", user);

    /*to sender*/
    io.emit('message sent', msg);

    /*to everyone (TODO: should be 1-1) except sender*/
    socket.broadcast.emit('new message', {msg: msg, from: user});

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

    var user = _getUserFromList(email);

    /*to everyone except sender*/
    socket.broadcast.emit('user logged out', user);
  });

  socket.on('getusers', function(){
    /*to sender*/
    io.emit('users list', users);
  });

});

function _addUser2List(email, socket) {
  var userObj = _getUserObj(email, socket);
  users.push(userObj);

  //console.log("Remaining users: ", users);
  return userObj;
}

function _removeUserFromList(email){
  users = users.filter(function(user){
    return user.email !== email;
  });

  //console.log("Remaining users: ", users);
}


function _getUserObj(email, socket) {

  console.log("Logged in Socket", socket.id);

  var gravatarImg = "http://www.gravatar.com/avatar/" + md5(email),
      username = email.split("@")[0];

  return {username: username, email: email, gravatar: gravatarImg, socketID: socket.id}
}


function _getUserFromList(email) {
  for (var i = users.length - 1; i >= 0; i--) {
    if(users[i].email === email) {
      return users[i];
    }
  };
}

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});
