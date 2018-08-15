'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	githubId: String,
	name: String,
	username: String,
	location: String,
	avatarUrl: String,
	books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
});

module.exports = mongoose.model('User', User);
