/*
 * Meme Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mememarket");
var db = mongoose.connection;

mongoose.Promise = global.Promise;

//Meme Schema
var MemeSchema = new mongoose.Schema({
	meme : {
		type : String,
		index : true
	},
	score : {
		type : Number
	},
	timestamp : {
		type : Date
	}
});

var Meme = module.exports = mongoose.model('memes', MemeSchema);

module.exports.getHistoryByMeme = function(meme, callback) {
	Meme.find({'meme' : meme}, callback);
}

module.exports.createMeme = function(newMeme, callback) {
	newMeme.save(callback);
}