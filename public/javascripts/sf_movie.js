$(document).ready(function(){
	// list of google map markers
	var markers = [];

	var searchByMovie = true;

	var resultsContainer = $('[data-container=results]');

	var directorParam = $('[data-query-param="director_name"]');

	var titleParam = $('[data-query-param="title_name"]');

	directorParam.hide(); // hide search director input field initially

	// generate info window template
	function createInfoWindowContent(director, title, location) {
		var contentString = 
			'<div class = "text-capitalize">'+ "Movie Name: " + title + '</div>' + 
			'<div class = "text-capitalize">'+ "Director: " + director + '</div>' + 
			'<div class = "text-capitalize">'+ "Location: " + location + '</div>';
		return contentString;
	}

	// add markers and info windows in the map
	function addMarker(result, option) {
		var infowindow = new google.maps.InfoWindow({
		   content: createInfoWindowContent(result.director, 
		   		result.title, result.location),
		   minWidth: 50,
		   maxWidth: 200
		 });

		var marker = new google.maps.Marker({
		    position: {
		    	lat: result.lat,
		    	lng: result.lng
		    },
		    map: map,
		    title: option === "director" ? result.director : result.title
		});

		markers.push(marker);

		marker.addListener('click', function() {
		   infowindow.open(map, marker);
		 });

	}

	//event trigger for search by director name and call directors public api
	directorParam.keyup(function(event) {

		var src = "{{#each directors}}" + 
	      		  "<li><a class = 'text-capitalize' href='#''>{{this}}</a></li>" +
	      		  "{{/each}}";

		var resultsTemplate = Handlebars.compile(src);
		$.ajax({
			url: '/api/director',
			data: {
				name: directorParam.val()
			},
			method: 'GET',
			success: function (jsonResponse) {
				var tableHtml = resultsTemplate({
					directors: jsonResponse.directors
				});
				resultsContainer.html(tableHtml)
				resultsContainer.show();
				markers.forEach(function (marker) {
					marker.setMap(null);
				});
				markers = [];

				if(jsonResponse.data && jsonResponse.data.length > 0){
					jsonResponse.data.forEach(function (result){
						addMarker(result, "director");
					});	
				} else {
					resultsContainer.hide();
				}
			},
			error: function (err) {
				//TODO
			}
		});
	});	

	//event trigger for search by title and call titles public api
	titleParam.keyup(function(event) {

		var src = "{{#each titles}}" + 
	      		  "<li><a class = 'text-capitalize' href='#''>{{this}}</a></li>" +
	      		  "{{/each}}";

		var resultsTemplate = Handlebars.compile(src);
		$.ajax({
			url: '/api/titles',
			data: {
				name: titleParam.val()
			},
			method: 'GET',
			success: function (jsonResponse) {
				var tableHtml = resultsTemplate({
					titles: jsonResponse.titles
				});
				resultsContainer.html(tableHtml)
				resultsContainer.show();

				markers.forEach(function (marker) {
					marker.setMap(null);
				});
				markers = [];
				
				if(jsonResponse.data && jsonResponse.data.length > 0) {
					jsonResponse.data.forEach(function (result){
						addMarker(result, "title");
					});	
				} else {
					resultsContainer.hide();
				}
			},
			error: function (err) {
				//TODO
			}
		});
	});	

	//Display selected auto compalete pins
	resultsContainer.on('click', 'li', function (event) {
		var title = $(event.target).text();
		if (searchByMovie) {
			titleParam.val(title);
		} else {
			directorParam.val(title);
		}
		markers.forEach(function (marker) {
			if (marker.title !== title) {
				marker.setMap(null);
			}
		resultsContainer.hide();
		});
	}); 

	//switch between search by movie / director
	$("[data-contiainer='search-type']").on('click', 'li', function (event) {
		searchByMovie = event.target.text == "Movie"
		if (!searchByMovie && $('[aria-expanded="true"]').text() ==="Movie") {
			titleParam.val('');
			titleParam.hide();
			directorParam.show();
			resultsContainer.hide();
			markers.forEach(function (marker) {
					marker.setMap(null);
				});
		} else if (searchByMovie  && $('[aria-expanded="true"]').text() !=="Movie") {
			directorParam.val('');
			directorParam.hide();
			titleParam.show();
			resultsContainer.hide();
			markers.forEach(function (marker) {
				marker.setMap(null);
			});
		}
	}); 
});
