const { Department } = require('../models/Department');

const create = async function (req, res, next) {
  let doc = new Department(req.body);
  doc.org = req.params._id;
  doc.save();
  res.json({
    status: 'success',
    data: doc
  });
}

const getById = async function (req, res, next) {

};
const getList = async function (req, res, next) {
  let list = await Department.find({org: req.params._id});
  res.json({
    status: 'success',
    data: {
      list: list
    }
  });
};
const updateById = async function (req, res, next) {

};
const removeById = async function (req, res, next) {

};

module.exports = {
  create,
  getById,
  getList,
  updateById,
  removeById
}