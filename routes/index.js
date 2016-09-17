var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:memeName',function(req,res,next)){
	var memeName = req.params.memeName;
	var requestify = require('requestify');
	requestify.get("https://memegen.link/" + memeName).then(function(response){
		response.getBody();
		console.log(reponse.body);
	})


}

module.exports = router;
