'use strict';

var path = process.cwd();
var SearchHandler = require(path + '/app/controllers/searchHandler.server.js');

module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.json({});
		}
	}

  var searchHandler = new SearchHandler();
  var redirectURL = '/';
  var redirectObj = {
    successRedirect: redirectURL,
    failureRedirect: redirectURL
  };

  app.route('/auth/github')
   .all(function(req, res, next) {
     redirectURL = req.get('Referrer');
     redirectObj.successRedirect = redirectURL;
     redirectObj.failureRedirect = redirectURL;
     return next();
   })
   .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', redirectObj));

  app.route('/logout')
  	.get(function (req, res) {
  		req.logout();
  		res.json({});
	});

  app.route('/api/user')
    .get(isLoggedIn, searchHandler.getLoggedInUser);

  app.route('/api/users')
  	.get(searchHandler.getUsers);

  app.route('/api/users/:username')
  	.get(searchHandler.getUserData)
    .post(isLoggedIn, searchHandler.updateUser);

  app.route('/api/books')
     .get(searchHandler.getBooks)
     .post(isLoggedIn, searchHandler.saveBook);

  app.route('/api/books/:bookId')
     .get(searchHandler.getBookData)
     .post(isLoggedIn, searchHandler.updateBook);

  app.route('/api/requests')
     .get(isLoggedIn, searchHandler.getRequests)
     .post(isLoggedIn, searchHandler.createRequest);

  app.route('/api/requests/:id')
     .post(isLoggedIn, searchHandler.updateRequest);

	app.route('*')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

};
