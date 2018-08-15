'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

  passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
  },
  function (token, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne({ 'githubId': profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.githubId = profile.id;
          newUser.username = profile.username;
          newUser.name = profile.displayName || '';
          newUser.location = profile._json.location || '';
          newUser.avatarUrl = profile._json.avatar_url || '';

          newUser.save(function (err) {
            if (err) {
              throw err;
            }

            return done(null, newUser);
          });
        }
      });
    });
	}));

};
