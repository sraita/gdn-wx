
const { User } = require('../models/User');
const { Team } = require('../models/Team');
const { TeamMember } = require('../models/TeamMember')
const { resSuccess, resError } = require('../utils/response');

const qr_image = require('qr-image');

/**
 * 生成固定长度的数字随机码
 * @param {Number} len  验证码长度
 */
function build_sms_code(len = 4) {
  let p = '1234567890'
  let str = '';
  for (let i = 0; i< len; i++) {
    str += p.charAt(Math.random() * p.length | 0)
  }
  return str;
}

module.exports = {
  index: async (req, res, next) => {
    let filters = [];

    const list = await Team.find({});
    const total = await Team.countDocuments();

    res.json({
      code: 0,
      data: {
        list,
        total
      }
    });
  },
  newTeam: async (req,res,next) => {
    const newTeam = new Team(req.body);
    newTeam.code = build_sms_code();
    let team = await newTeam.save();
    resSuccess(res, '', team);
  },
  getTeam: async (req,res,next) => {
    const team = await Team.findById(req.params._id);
    resSuccess(res,'',team);
  },
  updateTeam: async (req, res, next) => {
    const team = await Team.findByIdAndUpdate(req.params._id, req.body, {new: true});
    res.json({code: 0, data: team})
  },
  deleteTeam: async (req, res, next) => {
    const team = await Team.findByIdAndRemove(req.params._id);
    res.json({ code: 0, message: '团队解散成功'})
  },

  // 二维码
  getQrImage: async (req, res, next) => {
    var temp_qrcode = qr_image.image('http://www.baidu.com');
    res.type('png');
    temp_qrcode.pipe(res);
  },

  // 获取成员列表
  getMembers: async (req, res, next) => {
    const list = await TeamMember.find({team: req.params._id});
    res.json({code: 0, data:{
      list
    }});
  },
  
  // 添加审批人
  addAssignee: async (req, res, next) => {
    let team = await Team.updateOne({_id:req.params._id},{
      $addToSet: {
        assigneeList: [req.body.assignee]
      }
    });
    res.json({code: 0, messagee: '审批人添加成功'})
  },
  // 移除审批人
  removeAssignee: async (req, res, next) => {
    let team = await Team.updateOne({ _id: req.params._id }, {
      $pull: {
        assigneeList: [req.body.assignee]
      }
    });
    res.json({ code: 0, messagee: '审批人移除成功' })
  }
}