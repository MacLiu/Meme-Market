var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var Clarifai = require('clarifai');
 
var Meme = require('../models/meme');

var globalMemeName;

Clarifai.initialize({
  'clientId': 'AW_gcyJN5ff5VjdkXEblqdfRAYZXmM887WvngDaQ',
  'clientSecret': 'U19JDAr5qNBKZ7NjWKYkIQrRubQt874GAwDIaC2E'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/meme/:memeName',function(req,res,next){
	var memeName = req.params.memeName;
	globalMemeName = memeName;
	var requestName = 'https://memegen.link/templates/' + memeName;
	requestify.get(requestName).then(function(response){
		var json = response.getBody();
		console.log(json.example);
		var imgURL = json.example;
		var first = imgURL.substring(0,21 + memeName.length);
		var middle = '/_/_.jpg';
		var final = first + middle;
		Clarifai.getTagsByUrl(final).then(
			function handleResponse(response0){
			  var baseURL = 'https://www.reddit.com/r/adviceanimals/hot/.json?limit=100'
			  requestify.get(baseURL).then(function(response){
			  	var json = response.getBody();
			  	var data = json.data;
			  	var children = data.children;
			  	var after = data.after;
			  	var score = 0;
			  	var matches = [];
			  	for(var i = 0;i<children.length;i++){
			  		var post = children[i];
			  		var postdata = post.data;
			  		if(!(postdata.is_self)){
			  			var imgURL = postdata.url;
			  			var filetype = imgURL.substring(imgURL.length-3,imgURL.length);
			  			if(!(filetype === 'jpg'||filetype === 'png')){
			  				imgURL = imgURL + '.jpg';
			  			}
			  			
			  			matches[i] = Clarifai.getTagsByUrl(imgURL).then(
			  				function handleResponse(response1) {
			  					if (compareMemeObjects(response0, response1)) {
			  						return true;
			  					} else {
			  						return false;
			  					}

			  				},
			  				handleError
						);
			  		}
			  	}
			  	for(var i = 0;i<matches.length;i++){
					var post = children[i];
					var postdata = post.data;
					if (matches[i]) {
						score += postdata.num_comments + postdata.score;
					}
				}

			  	var newMeme = new Meme({
			 		'meme' : globalMemeName,
			  		'score' : score,
			  		'timestamp' : new Date().getTime()
			  	});
			  	Meme.createMeme(newMeme, function(error, resMeme) {
			  		Meme.getHistoryByMeme(globalMemeName, function(err, his) {
			  			if (err) {
			  				console.log("error");
			  			} else {
			  				his.push(resMeme);
			  				res.send(his);
			  			}
			  		});
			  	});
			  })
			  .fail(function(response){
			   
			  });
			},
			handleError
		);

	})
	.fail(function(response){
		res.send(response.getCode());
	});


});

router.get('/allmemes',function(req,res,next){
	var requestName = 'https://memegen.link/templates/';
	requestify.get(requestName).then(function(response){
		res.send(response.getBody());
	});
});

function handleError(err){
  //console.log('promise error:', err);
};

function compareMemeObjects(meme1, meme2) {
	var tags1 = meme1.results[0].result.tag.classes;
	var tags2 = meme2.results[0].result.tag.classes;


	var same = 0;
	for (var i = 0; i < tags1.length; i++) {
		for (var j = 0; j < tags2.length; j++) {
			if (tags1[i] == tags2[j]){
				same += 1;
				break;
			}
		}
	}
	var ratio = same / tags1.length;
	if (ratio > 0.5) {
		return true;
	} else {
		return false;
	}
	
}

module.exports = router;
