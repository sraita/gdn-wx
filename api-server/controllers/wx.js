const request = require('request');

export function getAccessToken() {
  let { APP_ID, APP_SECRET} = CONFIG.WECHAT_MINI_PROGRAM;
  let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`;

  
}