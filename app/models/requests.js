'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Request = new Schema({
	book: String,
	owner: String,
	requester: String,
	status: String,
});

module.exports = mongoose.model('Request', Request);
