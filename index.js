var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// store id's of connected clients
var allClients = [];

io.sockets.on('connection', function(socket) {
  console.log('connection!: id=' + socket.client.id);
  // could push whole socket instead, need to look into whether it's suitable
  // to use client id here
  allClients.push(socket.client.id);

  socket.on('disconnect', function() {
    console.log('disconnection!: id=' + socket.client.id);
    var i = allClients.indexOf(socket.client.id);
    // remove from all clients list
    allClients.splice(i, 1);
  });

  io.emit('nothing', {});

});


http.listen(process.env.PORT || 3000);
console.log('listening!');
