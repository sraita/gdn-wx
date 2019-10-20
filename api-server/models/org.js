const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  // 部门名称
  name: {
    type: String,
    required: true
  }, 
  // 上级部门
  parent: { type: mongoose.Types.ObjectId, ref: 'org', default: null },
  type: {
    type: String,
    enum: ['company','department','team'],
    default: 'department'
  },
  owner: {type: mongoose.Types.ObjectId, ref: 'user'}, 
  defaultRoleGroup: { type: mongoose.Types.ObjectId, ref: 'roleGroup' }, 
  status:Number, // 0: 禁用, 1:启用
  createAt: Date
});

// 设置索引
OrgSchema.index({ code: 1 });
OrgSchema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
OrgSchema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

OrgSchema.pre('find', function (next) {
  this.populate('children')
  next()
})

OrgSchema.pre('save', function (next) {
  Org.findByIdAndUpdate(this.parent, {
    $addToSet:{
      children: this.id
    }
  });
  next();
});

const Org = mongoose.model('org', OrgSchema);

module.exports = { Org };