const mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  config = require('./config'),
  dbConfig = config.project;
  
let connectURL = `${config.MONGO_URL}/${config.MONGO_DBNAME}`;

let client = MongoClient.connect(connectURL, { useNewUrlParser: true, useUnifiedTopology: true });

client.then(async (db) => {

  let DB = db.db(config.MONGO_DBNAME);

  await new Promise(async (resolve, reject) => {
    console.log('开始创建用户数据');
    let roleColl = DB.collection('roles');
    let userColl = DB.collection('users');

    // 创建内置角色
    let role = await roleColl.insertOne({
      name: '超级管理员', // 角色名称
      code: 'SYS_SUPER_ADMIN',
      desc: '系统超级管理员【内置角色】',
      mutex: [], // 指定该角色不能与那些角色共存
      single: true,
      menus: [],
    });
    console.log(role.ops[0]);
    // 创建系统管理员
    await userColl.insertOne({
      username: 'sadmin',
      password: '$2b$10$G4pk6itcEine3CfHiJqfo.c0Cy25fu9bWSk/gXLJ378mI3JNYQdA.',  // 123456
      nickname: '超级管理员',
      roles: [role.ops[0]._id]
    });
    resolve();
  })
    .then(res => {
      console.log('用户数据创建成功');
    })
});
