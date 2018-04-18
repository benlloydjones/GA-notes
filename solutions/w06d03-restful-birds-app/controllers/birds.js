const Bird = require('../models/bird');

function indexRoute(req, res, next) {
  Bird
    .find()
    .populate('category')
    .exec()
    .then((birds) => res.json(birds))
    .catch(next);
}

function createRoute(req, res, next) {
  Bird
    .create(req.body)
    .then((bird) => res.status(201).json(bird))
    .catch(next);
}

function showRoute(req, res, next) {
  Bird
    .findById(req.params.id)
    .populate('category')
    .exec()
    .then((bird) => {
      if(!bird) return res.notFound();

      res.json(bird);
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Bird
    .findById(req.params.id)
    .exec()
    .then((bird) => {
      if(!bird) return res.notFound();

      Object.assign(bird, req.body);
      return bird.save();
    })
    .then((bird) => res.json(bird))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Bird
    .findById(req.params.id)
    .exec()
    .then((bird) => {
      if(!bird) return res.notFound();

      return bird.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  update: updateRoute,
  delete: deleteRoute
};
