const express = require('express');
const router  = express.Router();

const characters = require('../controllers/characters');

router.route('/characters')
  .get(characters.index)
  .post(characters.create);
router.route('/characters/:id')
  .get(characters.show)
  .put(characters.update)
  .patch(characters.update)
  .delete(characters.delete);

module.exports = router;
