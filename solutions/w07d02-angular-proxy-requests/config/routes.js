const router = require('express').Router();

const cities = require('../controllers/cities');
const skiddle = require('../controllers/skiddle');

router.get('/events', skiddle.proxy);

router.route('/cities')
  .get(cities.index)
  .post(cities.create);
router.route('/cities/:id')
  .get(cities.show)
  .put(cities.update)
  .delete(cities.delete);

module.exports = router;
