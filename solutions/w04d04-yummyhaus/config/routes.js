const router = require('express').Router();
const restaurants = require('../controllers/restaurants');

router.get('/', (req, res) => res.render('home'));

router.route('/restaurants')
  .get(restaurants.index)
  .post(restaurants.create);

router.get('/restaurants/new', restaurants.new);

router.route('/restaurants/:id')
  .get(restaurants.show)
  .put(restaurants.update)
  .delete(restaurants.delete);

router.get('/restaurants/:id/edit', restaurants.edit);

module.exports = router;
