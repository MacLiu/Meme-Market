/*
 * Meme Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mememarket");
var db = mongoose.connection;

//Meme Schema
var UserSchema = new mongoose.Schema({
	meme : {
		type : String,
		index : true
	},
	score : {
		type : Double
	}
});

var User = module.exports = mongoose.model('users', UserSchema);

/*
 *	Function hashs user's password. 
 *	TODO - UPDATE HASHING METHOD, TOO SIMPLE ATM
 */
var hash = function (str) {
	var result = "";
	var charcode = 0;
	for (var i = 0; i < str.length; i++) {
        charcode = (str[i].charCodeAt()) + 3;
        result += String.fromCharCode(charcode);	
    }
	return result;
};

/*
 *	Function compares the login password given, to the user's stored password.
 */
module.exports.comparePassword = function(candidatePassword, hashp, callback) {
	candidatePassword = hash(candidatePassword);
	if (candidatePassword == hashp) {
		callback(null, true);
	} else {
		callback(null, false);
	}
}

/*
 *	Function returns the user from the given ID
 */
module.exports.getUserById = function(id, callback) {
	Applicant.findById(id, callback);
}

/*
 *	Function creates a new user from given user information
 */
module.exports.createUser = function(newUser, callback) {
	newUser.save(callback);
}


