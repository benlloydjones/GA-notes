const Shoe = require('../models/shoe');

function shoesIndex(req, res) {
  Shoe
    .find()
    .exec()
    .then(shoes => res.json(shoes));
}

function shoesCreate(req, res) {
  Shoe.create(req.body)
    .then(shoe => res.status(201).json(shoe));
}

function shoesShow(req, res) {
  Shoe.findById(req.params.id)
    .exec()
    .then(shoe => res.json(shoe));
}

function shoesUpdate(req, res) {
  Shoe.findById(req.params.id)
    .exec()
    .then(shoe => {
      shoe = Object.assign(shoe, req.body);
      return shoe.save();
    })
    .then(shoe => res.json(shoe));
}

function shoesDelete(req, res) {
  Shoe.findById(req.params.id)
    .exec()
    .then(shoe => {
      shoe = Object.assign(shoe, req.body);
      return shoe.remove();
    })
    .then(() => res.status(204).json());
}

module.exports = {
  index: shoesIndex,
  create: shoesCreate,
  show: shoesShow,
  update: shoesUpdate,
  delete: shoesDelete
};
