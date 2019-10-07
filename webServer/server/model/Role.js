import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Role = new Schema({
  _id: ObjectId,
  name: String,
  code: String,
  state: Number,
  desc: String,
})