var express = require('express');
var router = express.Router();
var allMovies = require('../sf-movie.json').data.map(function (movieArray) {
  return {
    director: movieArray[14].toLowerCase(),
    title: movieArray[8].toLowerCase(),
    location: movieArray[10] && movieArray[10].toLowerCase()
  };
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/director', function(req, res) {
  if(!req.query.name) return res.json({});

  var directorParam = (req.query.name) ? req.query.name.toLowerCase() : '';

  var uniqueList = {};
  var filteredMovieArray = allMovies
    .filter(function (movieObj) {
      if(movieObj.director.indexOf(directorParam) === 0){
        uniqueList[movieObj.director] = true; 
        return true;
      }
    });
  
  res.json({
    directors: Object.keys(uniqueList),
    data: filteredMovieArray
  });
});

router.get('/api/title', function(req, res) {
  if(!req.query.name) return res.json({});

  var titleName = (req.query.name) ? req.query.name.toLowerCase() : '';
  var uniqueList = {};
  var filteredMovieArray = allMovies
    .filter(function (movieObj) {
      if (movieObj.title.indexOf(titleName) === 0){
        uniqueList[movieObj.title] = true;
        return true;
      }
    });
  
  res.json({
    titles: Object.keys(uniqueList),
    data: filteredMovieArray
  });
});

module.exports = router;
