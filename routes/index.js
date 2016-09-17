var express = require('express');
var router = express.Router();
var requestify = require('requestify');


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

module.exports = router;
