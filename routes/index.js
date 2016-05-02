var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var visits = parseInt(req.cookies.visits) || 0;
  visits += 1;
  res.cookie('visits', visits);
  res.render('index',
      { title: 'Express', name: 'World', visits: visits }
  );
});

module.exports = router;
