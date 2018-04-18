const Category = require('../models/category');

function indexRoute(req, res, next) {
  Category
    .find()
    .exec()
    .then((categories) => res.json(categories))
    .catch(next);
}

function createRoute(req, res, next) {
  Category
    .create(req.body)
    .then((category) => res.status(201).json(category))
    .catch(next);
}

function showRoute(req, res, next) {
  Category
    .findById(req.params.id)
    .exec()
    .then((category) => {
      if(!category) return res.notFound();

      res.json(category);
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Category
    .findById(req.params.id)
    .exec()
    .then((category) => {
      if(!category) return res.notFound();

      Object.assign(category, req.body);
      return category.save();
    })
    .then((category) => res.json(category))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Category
    .findById(req.params.id)
    .exec()
    .then((category) => {
      if(!category) return res.notFound();

      return category.remove();
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
