const router = require('express').Router();
const foods  = require('../controllers/foods');
const auth  = require('../controllers/auth');
const oauth  = require('../controllers/oauth');
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

router.route('/oauth/github')
  .post(oauth.github);

router.route('/oauth/facebook')
  .post(oauth.facebook);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
