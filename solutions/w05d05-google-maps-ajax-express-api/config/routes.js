const router = require('express').Router();
const cafes = require('../controllers/cafes');

router.route('/cafes')
  .get(cafes.index)
  .post(cafes.create);

router.route('/cafes/:id')
  .get(cafes.show)
  .put(cafes.update)
  .delete(cafes.delete);

module.exports = router;
