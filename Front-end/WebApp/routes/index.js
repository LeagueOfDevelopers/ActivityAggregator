var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('*', function(req, res, next) {
	var path = req.originalUrl.split('/');
	if(path.indexOf('api') != -1) {
		next();
	} else if(path.indexOf('admin') != -1) {
		res.render('admin');
	}
	else {
		res.render('index');
	}
})

/*router.get('/', function(req, res, next) {
	res.render('index')
});*/



/*router.get('/admin', function(req, res, next) {
	res.render('admin')
})
*/



module.exports = router;