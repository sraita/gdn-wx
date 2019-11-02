var { Menu } = require('../models/Menu');

const getList = async function (req, res, next) {
  let selector = {};
  if (req.query.parent) {
    selector = {parent: req.query.parent};
  }
  const list = await Menu.find(selector).sort({sort:1});
  res.json({
    status: 'success',
    data: {
      list: list
    }
  })
};

const create = function (req, res, next) {
  console.log(req.body);
  Menu.create(req.body).then(menu => {
    res.json({
      status: 'success',
      data: menu
    });
  }).catch(reason => {
    console.log(reason);
    res.json({
      status: 'error',
      message: reason
    })
  });
}

const updateById = function (req, res, next) {
  console.log(req.body)
  Menu.findByIdAndUpdate(req.params._id, req.body, (err, data) => {
    if (err) {
      return res.json({ status: 'error', message: err.message });
    }
    return res.json({ status: 'success', data: data });
  })
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
  updateById,
  remove
}