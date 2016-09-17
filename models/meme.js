/*
 * Meme Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mememarket");
var db = mongoose.connection;

//Meme Schema
var MemeSchema = new mongoose.Schema({
	meme : {
		type : String,
		index : true
	},
	score : {
		type : Double
	}
});

var Meme = module.exports = mongoose.model('memes', MemeSchema);

module.exports.getHistoryByMeme = function(meme, callback) {
	Meme.find("_meme" : meme, callback);
}

module.exports.saveMeme = function(meme, callback) {
	meme.save(callback);
}


