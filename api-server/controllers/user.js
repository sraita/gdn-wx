const { construct, destruct } = require('@aximario/json-tree');
//处理node request请求
const request = require('request');

const { User } = require('../models/User');
const { Menu } = require('../models/Menu');
const { Role } = require('../models/Role');
const { Order } = require('../models/Order');

const { verifyToken, generateToken} = require('../utils/token');
const { resSuccess, resError } = require('../utils/response');


module.exports = {
  index: async (req, res, next) => {
    let list = await User.find();
    let total = await User.countDocuments();

    res.json({code: 0, data: {
      list,
      total
    }})
  },
  // User Register
  register: async (req, res, next) => {
    const {username} = req.body;
    if (await User.find({ username: username }).count() > 0) {
      return resError(res, 422, 'already_exists', '账号已存在!');
    }
    let _id = mongoose.Types.ObjectId();
    req.body._id = _id;
    let user = new User(req.body);
    // 生成 token
    const token = generateToken(userId, 3600);
    user.token = token;
    user.save();
    return resSuccess(res,'账号注册成功',token);
  },
  // User Login
  login: async (req,res,next) => {
    console.log('===sr===')
    const {username,password} = req.body;
    let user = await User.findOne({ username: username});
    if (!user) { // 检查用户是否存在
      return resError(res, 'user_not_found', '账号不存在.');
    }
    // 检查用户是否被锁定
    if (user.status == 0) {
      return resError(res, 'user_was_locked', '账号被锁定，请联系管理员');
    }
    // 检查密码是否匹配
    let isPasswordValid = require('bcrypt').compareSync(password, user.password);
    if (!isPasswordValid) {
      return resError(res, 'incorrect_password', '密码错误');
    }
    const token = generateToken(user._id, 3600);
    await User.findByIdAndUpdate(user._id, {
      $set: {
        token: token
      }
    });
    return resSuccess(res, '登录成功', {token});
  },
  // 微信小程序登录 - 关联user 与 微信 openid
  wxLogin: async (req, res, next) => {
    //微信小程序设置
    const wx = CONFIG.WECHAT_MINI_PROGRAM; //文件中存储了appid 和 secret

    let userInfo = req.body.userInfo;

    // 获取 openid, session_key
    let wxRequestOptions = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/sns/jscode2session?',
      formData: {
        appid: wx.APP_ID,
        secret: wx.APP_SECRET,
        js_code: req.body.code,
        grant_type: 'authorization_code'
      }
    }
    console.log(wxRequestOptions)
    
    request(wxRequestOptions, async (err, response, body)=> {
        if (err) {
          console.log(err);
          res.status(400).json({
            code: -1,
            message: err.message
          })
        } else {
          const { session_key, openid } = JSON.parse(body);
          console.log({ session_key, openid })
          let user = await User.findOne({ openid: openid });
          if (!user) {
            let userObj = {
              openid,
              username: openid,
              password: '123456',
              avatar: userInfo.avatarUrl,
              city: userInfo.city,
              gender: userInfo.gender,
              nickName: userInfo.nickName
            };
            console.log(userObj);
            user = new User(userObj);
            user.save();
          }
          // 创建 token
          const token = generateToken(user._id, 3600);
          // update user token
          await User.findByIdAndUpdate(user._id,{
            $set:{token: token}
          });
          resSuccess(res,'',{token});
        }
      })
  },
  // Get User Info
  info: async (req, res, next) => {
    // 解析token 获得 userId
    console.log(req.headers);
    if (!req.headers.authorization) {
      return resError(res, 401, 'user_not_login', '请先登录');
    }

    const _id = verifyToken(req);
    let user = await User.findOne({ _id: _id }).populate('menus').populate('team');
    user.roles = ['admin'];
    return resSuccess(res, '登录成功', user);
  },
  // Get User Routes 
  userRoutes: async (req, res, next) => {
    const user = await User.findOne({_id: req.params._id});
    const roles = await Role.find({ _id: { $in: user.roles } }).populate({
      path:'menus',
      options:{
        sort:{order: 1}
      }
    });
    let menus = [];
    for (let [key, value] of roles.entries()) {
      menus = menus.concat(value.menus);
    }
    menus = Array.from(new Set(menus));

    let data = menus.map(item => {
      let obj = Object.assign({}, item);
      obj = {
        _id: item._id,
        name: item.name,
        parent: item.parent,
        component: item.component,
        path: item.path,
        type: item.type,
        redirect: item.redirect,
        meta: {
          title: item.title,
          icon: item.icon
        }
      }
      return obj;
    });
    const result = construct(data, {
      id: '_id',
      pid: 'parent',
      children: 'children'
    });

    console.log(result);
    resSuccess(res, '', result);
  },
  // User Logout
  logout: async (req, res, next) => {
    const {_id} = req.body;
    await User.updateOne({_id: _id},{$set: {
      token: null
    }});
    return resSuccess(res, '你已退出登录');
  },
  // 获取用户的订单列表
  getUserOrders: async (req, res, next) => {
    let selector = {
      creator: req.params._id
    };
    const list = await Order.find(selector);
    const total = await Order.countDocuments(selector);
    resSuccess(res, '获取用户订单列表成功', {
      list,
      total
    })
  }
};
