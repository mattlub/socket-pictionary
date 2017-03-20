(function () {

  var app = document.getElementsByClassName('app')[0];

  // initiate socket
  var socket = io();

  // how to hide this?
  // google hide client side javascript state variable
  var state = {
    artist: null,
    word: null,
    time: null
  }

  // to be implemented
  //state = loadState();

  Render.renderNameInputScreen(app, socket, loadGame);

  function loadGame () {
    console.log('loading game')
  }

})();
