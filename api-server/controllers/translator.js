const { Translator } = require('../models/Translator');


module.exports = {
  index: async (req, res, next) => {
    let page = req.query.page ? Number(req.query.page) : 1,
        limit = req.query.limit ? Number(req.query.limit) : 1;
        
    let skip = (page - 1) * limit;

    let selector = req.body;

    let list = await Translator.find(selector)
      .skip(skip)
      .limit(limit)
      .sort({create_time: -1});
    let total = await Translator.countDocuments({});

    res.json({
      code: 0, data: {
        list,
        total
      }
    })
  },
  newTranslator: async (req, res, next) => {
    let newTranslator = new Translator(req.body);
    await newTranslator.save();
    res.json({code: 0, data: newTranslator})
  },
  importTranslator: async (req, res, next) => {

    res.json({code: 0, data:{
      list: null
    }})
  }
}