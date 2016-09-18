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

function handleResponse(response1){
//  console.log('promise response:', JSON.stringify(response1));
  //do shit with original data
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
  			var img = postdata.url;
  			var filetype = img.substring(img.length-3,img.length);
  			if(!(filetype === 'jpg'||filetype === 'png')){
  				img = img + '.jpg';
  			}


  			console.log(img);
  		}
  	}
  })
  .fail(function(response){
   
  });
};

function handleError(err){
  console.log('promise error:', err);
};

module.exports = router;
