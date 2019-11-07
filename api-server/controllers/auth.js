const url = require('url');
var rp = require('request-promise');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');

var createError = require('http-errors');
const { SECRET, WECHAT_MINI_PROGRAM, PUBLIC_ROUTES } = require('../config');
const { User } = require('../models/user');
const { Role } = require('../models/Role');
const {WeChatAccount} = require('../models/WeChatAccount');

const { generateToken } = require('../utils/token');


/**
 * 微信登录信息解密函数
 * @param {*} appId 
 * @param {*} sessionKey 
 */
function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  console.log('key:',this.sessionKey);
  var sessionKey = Buffer.from(this.sessionKey, 'base64')
  encryptedData = Buffer.from(encryptedData, 'base64')
  iv = Buffer.from(iv, 'base64')

  try {
    // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
};

const baseAuth = function (req, res, next) {
  const {pathname, query} = url.parse(req.path);
  console.log(req.path);
  // 检查即将访问的接口是否是公共接口
  if (PUBLIC_ROUTES.includes(pathname)) {
    next();
  } else {
    // 判断用户是否登录
    if (!req.headers.authorization) {
      return res.status(401).json({
        status:'error',
        message: "请先登录"
      });
    }
    // 判断 token 是否正确并在有效期内

    const raw = String(req.headers.authorization.split(' ').pop());

    console.log(raw)
    // 解密 token 获取对应的 id
    try {
      const { id } = jwt.verify(raw, SECRET);
      req.body.userId = id;

      // 验证用户权限 
      const user = User.findById(id);
      
      if (!user) {
        return res.send({
          status: 'error',
          name: 'UserNotFound',
          message: '用户不存在'
        });
      }
      // if (user.status !== 1) {
      //   return res.send({
      //     status: 'error',
      //     name: 'UserWasDisable',
      //     message: '用户被禁用'
      //   });
      // }
      // 验证接口访问权限

      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        status: 'error',
        code: err.name === 'TokenExpiredError' ? 40101 : 40102,
        name: err.name,
        message: err.message
      });
    }
  }
}

const refreshToken = function (req, res, next) {
    const raw = req.query.token;
    // 解密 token 获取对应的 id
    try {
      const { id } = jwt.verify(raw, SECRET);
      const token_expire = Math.floor(Date.now() / 1000) + (60 * 60);// token 过期时间为60分钟
      const refresh_token_expire = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // refresh_token 过期时间为7 天
      const token = jwt.sign({
        exp: token_expire, 
        id: id
      }, SECRET);
      const refresh_token = jwt.sign({
        exp: refresh_token_expire,
        id:id
      }, SECRET);
      return res.json({
        status: 'success',
        data: {
          token: token,
          expire_in: 3600,
          refresh_token
        }
      })
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        status: 'error',
        name: err.name,
        message: err.message
      });
    }
}

const getUserInfo = async function (req, res, next) {
  const raw = String(req.headers.authorization.split(' ').pop());
  // 解密 token 获取对应的 id
  try {
    const { id } = jwt.verify(raw, SECRET);
    const user = await User.findById(id).populate('org').populate('roles').populate('department');
    res.json({
      status: 'success',
      data: user
    });
  } catch (err) {
    // TokenExpiredError
    return res.status(401).json({
      status: 'error',
      code: err.name === 'TokenExpiredError' ? 40101 : 40102,
      name: err.name,
      message: err.message
    });
  }
}

// 获取用户菜单列表
const getMenus = async function (req, res, next) {
  const raw = String(req.headers.authorization.split(' ').pop());
  // 解密 token 获取对应的 id
  try {
    const { id } = jwt.verify(raw, SECRET);
    let user = await User.findOne({_id:id});
    
    let roles = await Role.find({ _id: { $in: user.roles } }).populate('menus');
 
    let menus = [];
    for (let [key, value] of roles.entries()) {
      menus = menus.concat(value.menus);
    }
    menus = Array.from(new Set(menus));

    res.json({
      status: 'success',
      data: {
        list: menus
      }
    });
  } catch (err) {
    // TokenExpiredError
    return res.status(401).json({
      status: 'error',
      code: err.name === 'TokenExpiredError' ? 40101 : 40102,
      name: err.name,
      message: err.message
    });
  }

}

//  微信小程序登录
const loginWithUnionId = async function (req, res, next) {
  console.log(req.body);
  let { APP_ID, APP_SECRET} = WECHAT_MINI_PROGRAM;
  let { encryptedData, iv, code } = req.body;
  // 使用 临时登录凭证code 获取 session_key 和 openid 等
  var wx_url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APP_ID + '&secret=' + APP_SECRET + '&js_code=' + code + '&grant_type=authorization_code'

  rp(wx_url).then(async (wx_res) => {
    console.log(wx_res);
    let { session_key, openid } = JSON.parse(wx_res);
    var pc = new WXBizDataCrypt(APP_ID, session_key);
    var wx_userinfo = pc.decryptData(encryptedData, iv);
    let account = await WeChatAccount.findOne({openId: openid});
    if (!account) {
      account = new WeChatAccount(wx_userinfo);
      account.save();
    }
    let user = await User.findOne({openId: openid});
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 40103,
        name: 'User not Bind',
        message: '请绑定用户',
        data: {
          openId: openid
        }
      });
    }
    const { _id } = user
    res.json({
      status: 'success',
      data: {
        userId: _id,
        user,
        token: generateToken(_id, 3600),
        expire_in: 3600, //token接口调用凭证超时时间，单位（秒）
        refresh_token: generateToken(_id, 604800), // 刷新 token 过期时间为 7 天
      }
    });
  }).catch(function (err) {
    console.log('err:' + err);
    createError(500, err.message);
  });
}

// 微信账号绑定
const bindWeAppAccount = async function (req, res, next) {
  const {mobile, openId} = req.body;
  let user = await User.findOneAndUpdate({ username: mobile }, {
    $set: { openId: openId }
  });
  if (!user) {
    user = new User({
      username: mobile,
      openId,
      mobile,
      password: openId
    });
    user.save();
  }
  const {_id} = user
  res.json({
    status: 'success',
    data: {
      userId: user._id,
      user,
      token: generateToken(_id, 3600),
      expire_in: 3600, //token接口调用凭证超时时间，单位（秒）
      refresh_token: generateToken(_id, 604800), // 刷新 token 过期时间为 7 天
    }
  });
}
module.exports = {
  baseAuth,
  refreshToken,
  getUserInfo,
  getMenus,
  loginWithUnionId,
  bindWeAppAccount
};