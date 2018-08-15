'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
	bookId: String,
	title: String,
	authors: [ String ],
	imageUrl: String,
	owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	ISBN: {
		short: String,
		long: String
	}
	// timestamps: { createdAt: Date, updatedAt: Date }
},
{ timestamps: {} });

module.exports = mongoose.model('Book', Book);
