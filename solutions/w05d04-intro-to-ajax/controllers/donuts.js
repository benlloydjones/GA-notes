const Donut = require('../models/donut');

function donutsIndex(req, res) {
  Donut
    .find()
    .exec()
    .then(donuts => res.json(donuts))
    .catch(err => res.status(500).json(err));
}

function donutsShow(req, res) {
  Donut
    .findById(req.params.id)
    .exec()
    .then(donut => res.json(donut))
    .catch(err => res.status(500).json(err));
}

function donutsCreate(req, res) {
  console.log(req.body);
  Donut
    .create(req.body)
    .then(donut => res.status(201).json(donut))
    .catch(err => res.status(500).json(err));
}

function donutsUpdate(req, res) {
  Donut
    .findById(req.params.id)
    .exec()
    .then(donut => {
      donut = Object.assign(donut, req.body);
      return donut.save();
    })
    .then(donut => res.json(donut))
    .catch(err => res.status(500).json(err));
}

function donutsDelete(req, res) {
  Donut
    .findById(req.params.id)
    .exec()
    .then(donut => donut.remove())
    .then(() => res.status(204).json())
    .catch(err => res.status(500).json(err));
}

module.exports = {
  index: donutsIndex,
  show: donutsShow,
  create: donutsCreate,
  update: donutsUpdate,
  delete: donutsDelete
};
