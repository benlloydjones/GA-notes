const router = require('express').Router();
const shoes = require('../controllers/shoes');

router.route('/shoes')
  .get(shoes.index)
  .post(shoes.create);

router.route('/shoes/:id')
  .get(shoes.show)
  .put(shoes.update)
  .delete(shoes.delete);

module.exports = router;
