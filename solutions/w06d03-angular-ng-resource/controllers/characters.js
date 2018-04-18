module.exports = {
  index: charactersIndex,
  create: charactersCreate,
  show: charactersShow,
  update: charactersUpdate,
  delete: charactersDelete
};

const Character = require('../models/character');

function charactersIndex(req, res) {
  Character.find((err, characters) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json(characters);  
  });
}

function charactersCreate(req, res) {
  const character = new Character(req.body);
  character.save((err, character) => {
    if (err) return res.status(500).json({ messsage: 'Something went wrong.' });
    return res.status(201).json(character);
  });
}

function charactersShow(req, res) {
  Character.findById(req.params.id, (err, character) => {
    if (err) return res.status(500).json({ messsage: 'Something went wrong.' });
    if (!character) return res.status(404).json({ message: 'No character found. '});
    return res.status(200).json(character);
  });
}

function charactersUpdate(req, res) {
  Character.findByIdAndUpdate(req.params.id, req.body, (err, character) => {
    if (err) return res.status(500).json({ messsage: 'Something went wrong.' });
    if (!character) return res.status(404).json({ message: 'No character found. '});
    return res.status(200).json(character);
  });
}

function charactersDelete(req, res) {
  Character.findByIdAndRemove(req.params.id, err => {
    if (err) return res.status(500).json({ messsage: 'Something went wrong.' });
    return res.sendStatus(204);
  });
}
