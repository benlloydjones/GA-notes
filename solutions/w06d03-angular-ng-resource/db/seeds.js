const mongoose  = require('mongoose');
const Character = require('../models/character');
const config    = require('../config/config');

mongoose.connect(config.db);

// Data array containing seed data - documents organized by Model
const characters = [
  {
    'name': 'Anakin Skywalker',
    'lightsaber': 'Blue'
  },
  {
    'name': 'Luke Skywalker',
    'lightsaber': 'Blue'
  },
  {
    'name': 'Lowbacca',
    'lightsaber': 'Bronze'
  },
  {
    'name': 'Qui-Gon Jinn',
    'lightsaber': 'Green'
  },
  {
    'name': 'Yoda',
    'lightsaber': 'Green'
  },
  {
    'name': 'Yoshi Raph-Elan',
    'lightsaber': 'Orange'
  },
  {
    'name': 'Mace Windu',
    'lightsaber': 'Purple'
  },
  {
    'name': 'Count Dooku',
    'lightsaber': 'Red'
  },
  {
    'name': 'Darth Maul',
    'lightsaber': 'Red'
  },
  {
    'name': 'Darth Vader',
    'lightsaber': 'Red'
  },
  {
    'name': 'Sa Cuis',
    'lightsaber': 'White'
  }
];

Character.collection.drop();

characters.forEach(character => Character.create(character, (err, character) => {
  console.log(`${character.name} was saved`);
}));
