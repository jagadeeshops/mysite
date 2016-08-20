var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var track = { reqCount: global.allReqCount, hostCount: global.uniqueHostCount }
  res.render('index', { title: 'Jagadeeshops', track: track	 });
});

module.exports = router;
