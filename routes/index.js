var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var Clarifai = require('clarifai');
 
Clarifai.initialize({
  'clientId': 'LcIgxi53v6z8h9l_im-glEqZGDcDcO4GBWZ0W_1R',
  'clientSecret': 'l6bVGdWzifyAE_oxiU6qcvY8FIESxaArT7v-NxxM'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/meme/:memeName',function(req,res,next){
	var memeName = req.params.memeName;
	var requestName = 'https://memegen.link/templates/' + memeName;
	requestify.get(requestName).then(function(response){
		var json = response.getBody();
		var imgURL = json.example;
		var first = imgURL.substring(0,21 + memeName.length);
		var middle = '/_/_.jpg';
		var final = first + middle;
		Clarifai.getTagsByUrl(final).then(
  			handleResponse,
  			handleError
		);
		res.send(final);

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

function handleResponse(response0){
  var baseURL = 'https://www.reddit.com/r/adviceanimals/hot/.json?limit=100'
  requestify.get(baseURL).then(function(response){
  	var json = response.getBody();
  	var data = json.data;
  	var children = data.children;
  	var after = data.after;
  	for(var i = 0;i<children.length;i++){
  		var post = children[i];
  		var postdata = post.data;
  		if(!(postdata.is_self)){
  			var imgURL = postdata.url;
  			var filetype = imgURL.substring(imgURL.length-3,imgURL.length);
  			if(!(filetype === 'jpg'||filetype === 'png')){
  				imgURL = imgURL + '.jpg';
  			}

  			Clarifai.getTagsByUrl(imgURL).then(
  				function handleResponse(response1) {
  					compareMemeObjects(response0, response1);
  				},
  				handleError
			);
  		}
  	}
  })
  .fail(function(response){
   
  });
};

function handleError(err){
  console.log('promise error:', err);
};

function compareMemeObjects(meme1, meme2) {
	var tags1 = meme1.results[0].result.tag.classes;
	var tags2 = meme1.results[0].result.tag.classes;

	var same = 0;
	for (var i = 0; i < tag1.length; i++) {
		for (var j = 0; j < tag2.length; j++) {
			if (tag1[i] == tag2[j]){
				same += 1;
				break;
			}
		}
	}

	var ratio = same / tag1.length;
	if (ratio > 0.5) {
		return true;
	} else {
		return false;
	}
	
}

module.exports = router;
