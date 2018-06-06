var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('app/index');
});


router.get('/logout', (req, res, next) => {
  delete req.session.user;
  res.redirect('/login');
});

module.exports = router;
