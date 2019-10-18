var { Element } = require('../models/Element');

const create = function (req, res, next) {

  const element = new Element({
    name: req.body.name,
    sort: req.body.sort
  });

  element.menu = req.body.menu;
  element.save(function(err,doc) {
    if (err) {
      res.json({
        status: 'error',
        name: err.name,
        message: err.message
      })
    } else {
      res.json({
        status: 'success',
        data: element
      });
    }
  });
}

const updateById = function (req, res, next) {
  Element.findByIdAndUpdate(req.params._id,req.body, (err, result) => {
    if (err) {
      res.json({status: 'error', name: err.name, message: err.message})
    } else {
      res.json({status: 'success', data: result});
    }
  });
}

const removeById = function (req, res, next) {
  Element.findByIdAndRemove(req.params._id, (err, result) => {
    if (err) {
      res.json({ status: 'error', name: err.name, message: err.message })
    } else {
      res.json({ status: 'success', data: result });
    }
  });
}

const getListByMenuId = async function (req, res, next) {
  const list = await Element.find({menu: req.params.menuId}).sort({sort: 1}).populate('menu');
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