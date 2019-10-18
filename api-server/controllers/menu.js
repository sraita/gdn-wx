var { Menu } = require('../models/Menu');

const getList = async function (req, res, next) {
  const total = await Menu.countDocuments();
  const list = await Menu.find({}).limit(10).skip(0);
  res.json({
    status: 'success',
    data: {
      total: total,
      list: list
    }
  })
};

const create = async function (req, res, next) {
  console.log(req.body);
  const menu = await Menu.create(req.body);
  res.json({
    status: 'success',
    data: menu
  });
}

const remove = function (req, res, next) {
  Menu.findByIdAndRemove(req.params._id, (err, data) => {
    if (err) {
      return res.json({status: 'error', message: err.message});
    }
    return res.json({status: 'success', data: data});
  })
}

module.exports = {
  getList,
  create,
  remove
}