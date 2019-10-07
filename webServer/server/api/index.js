var express = require('express');
var Router = express.Router();
var app = express();

Router.route('/')
  .get(function (req, res) {
    res.send('ok');
  });


module.exports = Router;