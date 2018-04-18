const Food = require('../models/food');

function foodsIndex(req, res, next) {
  Food
    .find()
    .exec()
    .then(foods => res.json(foods))
    .catch(next);
}

function foodsCreate(req, res, next) {
  Food
    .create(req.body)
    .then(food => res.status(201).json(food))
    .catch(next);
}

function foodsShow(req, res, next) {
  Food
    .findById(req.params.id)
    .exec()
    .then((food) => {
      if(!food) return res.notFound();
      res.json(food);
    })
    .catch(next);
}

function foodsUpdate(req, res, next) {
  Food
    .findById(req.params.id)
    .exec()
    .then((food) => {
      if(!food) return res.notFound();
      food = Object.assign(food, req.body);
      return food.save();
    })
    .then(food => res.json(food))
    .catch(next);
}

function foodsDelete(req, res, next) {
  Food
    .findById(req.params.id)
    .exec()
    .then((food) => {
      if(!food) return res.notFound();
      return food.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: foodsIndex,
  create: foodsCreate,
  show: foodsShow,
  update: foodsUpdate,
  delete: foodsDelete
};
