var app = require('express')();
var http = require('http').Server(app);
var md5 = require('MD5');
var pem = require('pem');
var io = require('socket.io')(http);
var https;

var PORT = "3003", SECURE_PORT = "3004"; //"443";

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

io.on('connection', function(socket) {
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
    //_removeUserFromListUsingID(socket.id);
  });

  socket.on('chat message', function(msg){

    console.log('received message: ::::', msg, " From USer::", msg.sender, " TOOOO user", msg.to);

    var user = _getUserFromList(msg.sender.email),
        toUser = _getUserFromList(msg.to.email); //not using socket id

    /*if user not defined*/
    if(!user) {
      _addUser2List(msg.sender.email, socket);
    }

    /*to sender*/
    io.emit('message sent', msg);
    
    if(toUser && io.sockets.connected[toUser.socketID]) {
      io.sockets.connected[toUser.socketID].emit('new message', {msg: msg, from: user});
    }

    /*to everyone*/
    //socket.broadcast.emit('new message', {msg: msg, from: user});

  });

  socket.on('login', function(email){
    
    var userObj = _addUser2List(email, socket);

    /*to sender*/
    io.emit('loggedin', userObj);

    /*to everyone except sender*/
    socket.broadcast.emit('new user login', userObj);

  });


  socket.on('login back', function(email) {
    _removeUserFromList(email); //remove old socket user
    _addUser2List(email, socket);
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

  socket.on("send request", function(data) {
    console.log("MSGGGG:", data);
    var toUser = _getUserFromList(data.toEmail);
    if(io.sockets.connected[toUser.socketID]) {
      console.log("sending to ", toUser.socketID);
      io.sockets.connected[toUser.socketID].emit("new request", {from: data.from});
    }
  });

  socket.on("reponse to request", function(msg) {
    var toUser = _getUserFromList(msg.result.friend.email);
    if(io.sockets.connected[toUser.socketID]) {
      io.sockets.connected[toUser.socketID].emit("request result", {
        action: msg.result.action,
        from: msg.from
      });
    }
  });

});

function _addUser2List(email, socket) {
  var userObj = _getUserObj(email, socket);
  /*to remove if same user object is present with old socket id*/
  _removeUserFromList(email);
  users.push(userObj);
  return userObj;
}

function _removeUserFromList(email){
  users = users.filter(function(user) {
    return user.email !== email;
  });
}

function _removeUserFromListUsingID(id) {
  users = users.filter(function(user) {
    return user.socketID !== id;
  });
}


function _getDefaultImg() {
  var images = [
  "http://4.bp.blogspot.com/-SRSVCXNxbAc/UrbxxXd06YI/AAAAAAAAFl4/332qncR9pD4/s50-c/default-avatar.jpg",
  "https://u.ph.edim.co/default-avatars/45_42.jpg",
  "https://c336017.ssl.cf1.rackcdn.com/profile-default_s.png",
  "https://pbs.twimg.com/profile_images/1343385304/default_profile_2_normal_normal.png",
  "http://hackstory.net/upload/7/7b/Default-profile-_10.png",
  "http://www.csc.com/images/new/icons/comment_default_user_icon.png"
  ];
  return images[Math.round(Math.random() * (images.length-1))];
}


function _getUserObj(email, socket) {

  console.log("Logged in Socket", socket.id);

  var gravatarImg = "http://www.gravatar.com/avatar/" + md5(email) + "?d=" + _getDefaultImg(),
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
