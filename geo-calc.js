var fs = require("fs");
var geocoder = require('geocoder');
var sfData = require('./sf-movie.json');
var async = require('async');

var allMovies = sfData.data.map(function (movieArray) {
  return {
    director: movieArray[14].toLowerCase(),
    title: movieArray[8].toLowerCase(),
    location: movieArray[10] && movieArray[10].toLowerCase()
  };
});

var asyncCallbacks = [];
allMovies.forEach(function(movie, index) {
	console.log('currentIndex: ', index);
	asyncCallbacks.push(function(callback){
		console.log('sending request #', index);
		geocoder.geocode(allMovies[index].location + " San Francisco, CA", function(err, data){
			console.log('receiving response #', index);
			
			if(err) debugger;;
			if(!data.results[0]) debugger;
			allMovies[index].lat = data.results[0].geometry.location.lat;
			allMovies[index].lng = data.results[0].geometry.location.lng;

			// set timeout to avoid exceeding API rate limit
			setTimeout(function(){
				callback(null);
			},160);
		});
	});	
});

//write to file after finishing parsing raw json file
async.series(asyncCallbacks, function(err, results){
	fs.writeFile('formatted.json', JSON.stringify(allMovies),  function(err) {
	   if (err) {
	       return console.error(err);
	   }
	   console.log('wrote to formatted.json!!');
	});
});



