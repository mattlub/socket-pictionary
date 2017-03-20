var helpers = {

  quickCreateElement: function (type, opts) {
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

}
