const Restaurant = require('../models/restaurant');

function restaurantsIndex(req, res) {
  Restaurant
    .find()
    .exec()
    .then(restaurants => {
      res.render('restaurants/index', { restaurants });
    })
    .catch(err => res.render('error', { err }));
}

function restaurantsShow(req, res) {
  Restaurant
    .findById(req.params.id)
    .exec()
    .then(restaurant => res.render('restaurants/show', { restaurant }))
    .catch(err => res.render('error', { err }));
}

function restaurantsNew(req, res) {
  res.render('restaurants/new');
}

function restaurantsCreate(req, res) {
  Restaurant
    .create(req.body)
    .then(() => res.redirect('/restaurants'))
    .catch(err => res.render('error', { err }));
}

function restaurantsEdit(req, res) {
  Restaurant
    .findById(req.params.id)
    .exec()
    .then(restaurant => res.render('restaurants/edit', { restaurant }))
    .catch(err => res.render('error', { err }));
}

function restaurantsUpdate(req, res) {
  Restaurant
    .findById(req.params.id)
    .exec()
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body);
      return restaurant.save();
    })
    .then(restaurant => res.redirect(`/restaurants/${restaurant.id}`))
    .catch(err => res.render('error', { err }));
}

function restaurantsDelete(req, res) {
  Restaurant
    .findById(req.params.id)
    .exec()
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/restaurants'))
    .catch(err => res.render('error', { err }));
}

module.exports = {
  index: restaurantsIndex,
  show: restaurantsShow,
  new: restaurantsNew,
  create: restaurantsCreate,
  edit: restaurantsEdit,
  update: restaurantsUpdate,
  delete: restaurantsDelete
};
