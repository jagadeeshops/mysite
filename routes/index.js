var express = require('express');
var router = express.Router();
var model = require('../schemas')

/* GET home page. */
router.get('/', function(req, res, next) {
  var track = { reqCount: global.allReqCount, hostCount: global.uniqueHostCount }
  res.render('index', { title: 'Jagadeeshops', track: track  });
});


//this route will get one post at a time
router.get('/blog/:year(20\\d\\d)/:month([0-1][0-9])/:day([0-3][0-9])/:blogName', function(req, res, next) {
  debugger
  var track = { reqCount: global.allReqCount, hostCount: global.uniqueHostCount }
  model.posts.findOne({ }).lean(true).exec( function(err, data){
    if (err) {
      console.err(Date() + " unable to get posts in " + __filename)
      res.render('posts1', { title: 'Jagadeeshops', data: { type: "paragraph", data: "Unable to get posts." }   });
    }
    else {
      console.log(data)
      res.render('posts1', { title: 'Jagadeeshops', data: data   });
    }
  });
});


module.exports = router;
