
const { User } = require('../models/User');
const { Team } = require('../models/Team');
const { resSuccess, resError } = require('../utils/response');


module.exports = {
  index: async (req, res, next) => {
    const list = Team.find({});
    const total = Team.countDocuments();

    resSuccess(res, '', {
      list,
      total
    });
  },
  newTeam: async (req,res,next) => {
    const newTeam = new Team(req.body)
    const user = await User.findByIdAndUpdate(req.userId, {team:newTeam});
    newTeam.owner = user._id;
    let team = await newTeam.save();
    resSuccess(res, '', team);
  },
  getTeam: async (req,res,next) => {
    const team = await Team.findById(req.params._id);
    resSuccess(res,'',team);
  },
  updateTeam: async (req, res, next) => {
    const team = await Team.findByIdAndUpdate(req.params._id, req.body);

    resSuccess(req,'', team);
  },
  deleteTeam: async (req, res, next) => {
    const team = await Team.findByIdAndRemove(req.params._id);
    resSuccess(req,'团队解散成功','success');
  }

}