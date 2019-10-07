import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * 组织机构
 */
const Org = new Schema({
  _id: ObjectId,
  name: String,
  logo: String,
  desc: String,
  parent: String, // 上级组织机构名称
  type: Number, // 1: 公司， 2: 部门
});