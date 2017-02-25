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

// add logic for socket connection
io.sockets.on('connection', function(socket) {
  var id = socket.client.id;
  console.log('connection!: id=' + id);
  // could push whole socket instead, need to look into whether it's suitable
  // to use client id here
  allClients.push(id);

  // handle disconnect
  socket.on('disconnect', function() {
    console.log('disconnection! id=' + id);
    var i = allClients.indexOf(id);
    // remove from all clients list
    allClients.splice(i, 1);
    // send player disconnected event
    io.emit('player disconnected', {id: id});
  });

  socket.on('message', function(info) {
    io.emit('message', info);
  })

  // to remember syntax
  io.emit('nothing', {});

});

http.listen(process.env.PORT || 3000);
console.log('listening!');
