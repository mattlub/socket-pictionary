// initiate socket
var socket = io();

var app = document.getElementsByClassName('app')[0];

// helper function
function quickCreateElement(type, opts) {
  let el = document.createElement(type);
  for (let attr in opts) {
    if (attr === 'class') {
      el.classList.add(opts[attr]);
    }
    else if (attr === 'textContent') {
      el.textContent = opts[attr];
    }
    else {
      el.setAttribute(attr, opts[attr]);
    }
  }
  return el
}

// Name input logic
var name;
var nameInput = quickCreateElement('input', {
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
    loadGame();
  }
}

nameInput.addEventListener('keypress',  nameInputListener);
app.appendChild(nameInput);

function loadGame () {
  return
}
