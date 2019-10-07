import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * 组织机构
 */
const Job = new Schema({
  _id: ObjectId,
  name: String,
  code: String,
  desc: String,
  parent: String, // 上级组织机构名称
});