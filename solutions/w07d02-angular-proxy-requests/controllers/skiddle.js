const rp = require('request-promise');

function skiddleProxy(req, res) {
  rp({
    url: 'http://www.skiddle.com/api/v1/events/search',
    method: 'GET',
    json: true,
    qs: {
      api_key: process.env.SKIDDLE_API_KEY,
      latitude: req.query.lat,
      longitude: req.query.lng,
      eventcode: req.query.eventcode,
      radius: 5
    }
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
}

module.exports = {
  proxy: skiddleProxy
};
