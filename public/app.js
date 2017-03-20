// initiate socket
var socket = io();

var app = document.getElementsByClassName('app')[0];

function renderNameInputScreen (app, successCallback) {
  // Name input logic
  var name;
  var nameInput = helpers.quickCreateElement('input', {
    class: 'name-input',
    type: 'text',
    placeholder: 'Your name'
  });

  var nameInputListener = function (e) {
    // if enter pressed and input not empty
    if (e.keyCode === 13 && this.value.length !== 0) {
      name = this.value;
      this.removeEventListener('keypress', nameInputListener);
      this.classList.add('hidden');
      data = {name: name, socket: socket};
      console.log(socket.id);
      successCallback();
    }
  }
  nameInput.addEventListener('keypress',  nameInputListener);
  app.appendChild(nameInput);
}

renderNameInputScreen(app, loadGame);

function loadGame () {
  return
}
