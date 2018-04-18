const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');
const User = require('../models/user');

function github(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    qs: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: req.body.code
    },
    json: true
  })
    .then(token => {
      return rp({
        method: 'GET',
        url: 'https://api.github.com/user',
        qs: token,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      });
    })
    .then(profile => {
      return User
        .findOne({ $or: [{ githubId: profile.id }, { email: profile.email }] })
        .then((user) => {
          if(!user) {
            user = new User({
              username: profile.login,
              email: profile.email,
              image: profile.avatar_url
            });
          }

          user.githubId = profile.id;
          if(profile.email) user.email = profile.email;
          return user.save();
        });
    })
    .then(user => {
      const payload = { userId: user.id };
      const token = jwt.sign(payload, secret, { expiresIn: '1hr' });

      res.json({ message: `Welcome ${user.username}!`, token });
    })
    .catch(next);
}

function facebook(req, res, next) {
  rp({
    method: 'POST',
    url: 'https://graph.facebook.com/v2.10/oauth/access_token',
    qs: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      code: req.body.code,
      redirect_uri: req.body.redirectUri
    },
    json: true
  })
    .then(token => {
      return rp({
        method: 'GET',
        url: 'https://graph.facebook.com/v2.5/me?fields=id,email,name,picture',
        qs: token,
        json: true
      });
    })
    .then(profile => {
      return User.findOne({
        $or: [{ facebookId: profile.id }, { email: profile.email }]
      })
        .then(user => {
          if(!user) {
            user = new User({
              username: profile.name,
              facebookId: profile.id,
              image: profile.picture.data.url
            });
          }
          user.facbookId = profile.id;
          if(profile.email) user.email = profile.email;
          user.image = profile.picture.data.url;
          return user.save();
        });
    })
    .then(user => {
      const payload = { userId: user.id };
      const token = jwt.sign(payload, secret, { expiresIn: '1hr' });
      res.json({ token, message: `Welcome ${user.username}`});
    })
    .catch(next);
}

module.exports = { github, facebook };
