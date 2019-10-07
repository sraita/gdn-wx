import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  _id: ObjectId,
  username: String,
  password: String,
  avatar: String,
  createAt: Date,
});