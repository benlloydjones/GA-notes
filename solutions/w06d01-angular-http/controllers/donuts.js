const Donut = require('../models/donut');

function donutsIndex(req, res) {
  Donut
    .find()
    .exec()
    .then(donuts => res.status(200).json(donuts))
    .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function donutsCreate(req, res) {
  Donut
  .create(req.body)
  .then(donut => res.status(201).json(donut))
  .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function donutsShow(req, res) {
  Donut
  .findById(req.params.id)
  .exec()
  .then(donut => {
    if(!donut) return res.status(401).json({ message: 'No donut found'});
    res.json(donut);
  })
  .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function donutsUpdate(req, res) {
  Donut
  .findById(req.params.id)
  .then(donut => {
    if(!donut) return res.status(401).json({ message: 'No donut found'});

    for(const field in req.body) {
      donut[field] = req.body[field];
    }

    return donut.save();
  })
  .then(donut => res.json(donut))
  .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function donutsDelete(req, res) {
  Donut
  .findById(req.params.id)
  .then(donut => {
    if(!donut) return res.status(401).json({ message: 'No donut found'});
    return donut.remove();
  })
  .then(() => res.status(204).end())
  .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

module.exports = {
  index: donutsIndex,
  create: donutsCreate,
  show: donutsShow,
  update: donutsUpdate,
  delete: donutsDelete
};
