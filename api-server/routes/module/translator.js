const router = require('express-promise-router')();

const controller = require('../../controllers/translator');

router.route('/').post(controller.newTranslator);
router.route('/list').post(controller.index)

module.exports = router;