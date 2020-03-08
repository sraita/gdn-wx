const resSuccess = function (res,message, data) {
  res.json({
    status: 'success',
    code: 20000,
    message,
    data
  });
};

const resError = function (res, code, message, extras) {
  // res.status(400).json({
  //   status: 'error',
  //   code,
  //   message,
  //   extras: extras ? extras :[]
  // });
  res.status(400).json({
    error: code,
    message,
    detail: extras ? extras : {}
  });
}

module.exports = {
  resSuccess,
  resError
}