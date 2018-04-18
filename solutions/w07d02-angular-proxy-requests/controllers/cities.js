const City = require('../models/city');

function citiesIndex(req, res) {
  City
    .find()
    .exec()
    .then(cities => res.status(200).json(cities))
    .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function citiesCreate(req, res) {
  City
    .create(req.body)
    .then(city => res.status(201).json(city))
    .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function citiesShow(req, res) {
  City
    .findById(req.params.id)
    .exec()
    .then(city => {
      if(!city) return res.status(401).json({ message: 'No city found'});
      res.json(city);
    })
    .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function citiesUpdate(req, res) {
  City
    .findById(req.params.id)
    .then(city => {
      if(!city) return res.status(401).json({ message: 'No city found'});

      for(const field in req.body) {
        city[field] = req.body[field];
      }

      return city.save();
    })
    .then(city => res.json(city))
    .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

function citiesDelete(req, res) {
  City
    .findById(req.params.id)
    .then(city => {
      if(!city) return res.status(401).json({ message: 'No city found'});
      return city.remove();
    })
    .then(() => res.status(204).end())
    .catch(() => res.status(500).json({ message: 'Something went wrong'}));
}

module.exports = {
  index: citiesIndex,
  create: citiesCreate,
  show: citiesShow,
  update: citiesUpdate,
  delete: citiesDelete
};
