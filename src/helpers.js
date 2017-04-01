var helpers = module.exports = {};

helpers.selectRandom = function (arr) {
  if (arr.length === 0) {
    // TODO: think about this
    return undefined
  }
  return arr[Math.floor(Math.random() * arr.length)]
}
