var express = require('express');
var router = express.Router();

var controller = require('../controllers/user');

router.route('/')
  /**
   * @api {get} /api/user 获取用户列表
   * @apiDescription 获取用户列表
   * @apiName getUserList
   * @apiGroup User
   * @apiHeader {String} Authorization JWT.
   * @apiParam {string} page 页码
   * @apiParam {string} limit 每页条数
   * @apiSuccess  token 返回token
   * @apiSuccessExample {json} Success-Response:
   *  {
   *    "status": "ok"
   *    "data": {
   *      "total": 0
   *      "list": []
   *    }
   *  }
   * @apiSampleRequest http://localhost:3000/api/user
   * @apiVersion 1.0.0
   */
  .get(controller.getUserList)
  /**
   *
   * @api {post} /api/user 创建新用户
   * @apiName createUser
   * @apiGroup User
   * @apiVersion  1.0.0
   * @apiSampleRequest http://localhost:3000/api/user
   *
   * @apiHeader {String} Authorization JWT.
   * @apiParam  {String} paramName description
   *
   * @apiSuccess (200) {type} name description
   * @apiParamExample  {type} Request-Example:
   * {
   *     property : value
   * }
   *
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     property : value
   * }
   */
  .post(controller.createUser);

router.route('/:_id')
  /**
   * 
   * @api {get} /api/user/:_id 获取用户信息
   * @apiName getUserById
   * @apiGroup User
   * @apiVersion  1.0.0
   * 
   * @apiHeader {String} Authorization JWT.
   * @apiParam  {String} paramName description
   * 
   * @apiSuccess (200) {type} name description
   * 
   * @apiParamExample  {type} Request-Example:
   * {
   *     property : value
   * }
   * 
   * 
   * @apiSuccessExample {type} Success-Response:
   * {
   *     property : value
   * }
   * 
   * 
   */
  .get(controller.getUserById)
  .put(controller.updateUserById)
  .delete(controller.deleteUserById);

module.exports = router;
