const Cafe = require('../models/cafe');

function cafesIndex(req, res) {
  Cafe
    .find()
    .exec()
    .then(cafes => res.json(cafes))
    .catch(err => res.status(500).json(err));
}

function cafesShow(req, res) {
  Cafe
    .findById(req.params.id)
    .exec()
    .then(cafe => res.json(cafe))
    .catch(err => res.status(500).json(err));
}

function cafesCreate(req, res) {
  console.log(req.body);
  Cafe
    .create(req.body)
    .then(cafe => res.status(201).json(cafe))
    .catch(err => res.status(500).json(err));
}

function cafesUpdate(req, res) {
  Cafe
    .findById(req.params.id)
    .exec()
    .then(cafe => {
      cafe = Object.assign(cafe, req.body);
      return cafe.save();
    })
    .then(cafe => res.json(cafe))
    .catch(err => res.status(500).json(err));
}

function cafesDelete(req, res) {
  Cafe
    .findById(req.params.id)
    .exec()
    .then(cafe => cafe.remove())
    .then(() => res.status(204).json())
    .catch(err => res.status(500).json(err));
}

module.exports = {
  index: cafesIndex,
  show: cafesShow,
  create: cafesCreate,
  update: cafesUpdate,
  delete: cafesDelete
};
