var express = require('express');
var router = express.Router();

var controller = require('../controllers/user');

router.route('/')
  .get(controller.getUserList)
  .post(controller.createUser);

router.route('/:_id')
  .get(controller.getUserById)
  .put(controller.updateUserById)
  .delete(controller.deleteUserById);

module.exports = router;
