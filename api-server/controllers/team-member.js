
const { User } = require('../models/User');
const { Team } = require('../models/Team');
const { TeamMember } = require('../models/TeamMember')


module.exports = {// 添加团队成员
  addMember: async (req, res, next) => {
    const { userId, teamId, code} = req.body;
    let team = await Team.findById(teamId);
    if (!team) {
      return res.status(400).json({code: -1, message: '团队不存在'})
    }
    if (team.code !== code) {
      return res.status(400).json({ code: -1, message: '二维码已失效' })
    }
    let newMember = await TeamMember({
      user: userId,
      team: teamId
    });

    let member = await newMember.save();
    res.json({ code: 0, data: member });
  },
  // 移除团队成员
  deleteMember: async (req, res, next) => {
    let member = await TeamMember.findByIdAndRemove(req.params._id);
    res.json({code: 0, message: 'success'})
  }
}