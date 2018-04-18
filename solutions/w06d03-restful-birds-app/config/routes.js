const router = require('express').Router();
const birds = require('../controllers/birds');
const categories = require('../controllers/categories');

router.route('/birds')
  .get(birds.index)
  .post(birds.create);

router.route('/birds/:id')
  .get(birds.show)
  .put(birds.update)
  .delete(birds.delete);

router.route('/categories')
  .get(categories.index)
  .post(categories.create);

router.route('/categories/:id')
  .get(categories.show)
  .put(categories.update)
  .delete(categories.delete);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
