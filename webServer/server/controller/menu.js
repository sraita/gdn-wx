var Menu = require('../model/Menu');

var getList = function(req, res) {
  console.log(req.session)
  let sess = req.session;
  // console.log(`session id is: ${sess.id}`)
  Menu.find(function (err, list) {
    if (err) {
      res.json({ message: 'error', data: err });
      return;
    }
    return res.json({ message: 'ok', data: list });
  });
}


module.exports = {
  getList
}