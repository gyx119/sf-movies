var express = require('express');
var router = express.Router();
var allMovies = require('../formatted.json');
var memoHash = {};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/director', function(req, res) {
  if(!req.query.name) return res.json({});

  var directorParam = (req.query.name) ? req.query.name.toLowerCase() : '';

  var uniqueList = {};
  var filteredMovieArray = allMovies
    .filter(function (movieObj) {
      if(movieObj.director.indexOf(directorParam) === 0 && Object.keys(uniqueList).length <=10) {
        uniqueList[movieObj.director] = true; 
        return true;
      }
    });
  
  res.json({
    directors: Object.keys(uniqueList),
    data: filteredMovieArray
  });
});

router.get('/api/titles', function(req, res) {
  if(!req.query.name) return res.json({});

  // if(memoHash[req.query.name]){
  //   req.json(memoHash[req.query.name]);
  // }

  var titleName = (req.query.name) ? req.query.name.toLowerCase() : '';
  var uniqueList = {};
  var filteredMovieArray = allMovies
    .filter(function (movieObj) {
      if (movieObj.title.indexOf(titleName) === 0 && Object.keys(uniqueList).length <=10){
        uniqueList[movieObj.title] = true;
        return true;
      }
    });
  
  var result = {
    titles: Object.keys(uniqueList),
    data: filteredMovieArray
  };
  // memoHash[req.query.name] = result;
  // res.header('Content-Type': 'application/json');
  // res.status(200);
  res.json(result);
  console.log(res.headersSent);
});

module.exports = router;
