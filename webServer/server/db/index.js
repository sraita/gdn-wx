var mongoose = require('mongoose');

const db_url = 'mongodb://localhost:27017/gdn';

// 连接数据库
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("db open");
});

db.on('connected', function () {
  console.log('数据库链接成功!');
});
db.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

module.exports = db;