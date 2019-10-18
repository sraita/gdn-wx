var { Opt } = require('../models/Opt');

const create = function (req, res, next) {

  const opt = new Opt(req.body);

  opt.menu = req.body.menu;
  opt.save(function (err, doc) {
    if (err) {
      res.json({
        status: 'error',
        name: err.name,
        message: err.message
      })
    } else {
      res.json({
        status: 'success',
        data: doc
      });
    }
  });
}

const updateById = function (req, res, next) {
  Opt.findByIdAndUpdate(req.params._id, req.body, (err, result) => {
    if (err) {
      res.json({ status: 'error', name: err.name, message: err.message })
    } else {
      res.json({ status: 'success', data: result });
    }
  });
}

const removeById = function (req, res, next) {
  Opt.findByIdAndRemove(req.params._id, (err, result) => {
    if (err) {
      res.json({ status: 'error', name: err.name, message: err.message })
    } else {
      res.json({ status: 'success', data: result });
    }
  });
}

const getListByMenuId = async function (req, res, next) {
  const list = await Opt.find({ menu: req.params.menuId }).sort({ sort: 1 }).populate('menu');
  res.json({
    status: 'success',
    data: {
      list: list
    }
  });
}
module.exports = {
  create,
  updateById,
  removeById,
  getListByMenuId
}