$(document).ready(function(){
	// google map markers
	var markers = [];

	var searchByMovie = true;

	var resultsContainer = $('[data-container=results]');

	var directorParam = $('[data-query-param="director_name"]');

	var titleParam = $('[data-query-param="title_name"]');

	directorParam.hide();


	//event trigger for search by director name and call directors public api
	directorParam.keyup( function (event) {

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
						var marker = new google.maps.Marker({
						    position: {
						    	lat: result.lat,
						    	lng: result.lng
						    },
						    map: map,
						    title: result.director
						});
						markers.push(marker);
					});	
				} else {
					resultsContainer.hide();
				}
			},
			error: function (err) {

			}
		});
	});	

	//event trigger for search by title and call titles public api
	titleParam.keyup( function (event) {

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
						var marker = new google.maps.Marker({
						    position: {
						    	lat: result.lat,
						    	lng: result.lng
						    },
						    map: map,
						    title: result.title
						});
						markers.push(marker);
					});	
				} else {
					resultsContainer.hide();
				}
			},
			error: function (err) {

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
		} else if (searchByMovie  && $('[aria-expanded="true"]').text() !=="Movie") {
			directorParam.val('');
			directorParam.hide();
			titleParam.show();
			resultsContainer.hide();
		}
	}); 
});
