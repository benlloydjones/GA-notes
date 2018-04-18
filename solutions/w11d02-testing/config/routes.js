const router = require('express').Router();
const foods  = require('../controllers/foods');
const auth  = require('../controllers/auth');
const secureRoute = require('../lib/secureRoute');

router.route('/foods')
  .get(foods.index)
  .post(secureRoute, foods.create);

router.route('/foods/:id')
  .get(foods.show)
  .put(secureRoute, foods.update)
  .delete(secureRoute, foods.delete);

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.route('/*')
  .all((req, res) => res.notFound());

module.exports = router;
