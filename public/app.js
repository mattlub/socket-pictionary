// initiate socket
var socket = io();

var app = document.getElementsByClassName('app')[0];

Render.renderNameInputScreen(app, socket, loadGame);

function loadGame () {
  console.log('loading game')
}
