$(document).ready(function(){
	// google map markers
	var markers = [];

	var searchByMovie = true;

	var resultsContainer = $('[data-container=results]');
	
	$('[data-query-param="director_name"]').hide();


	//event trigger for search by director name and call director api
	$('[data-query-param="director_name"]').keyup( function (event) {

		var directoryParam = $('[data-query-param=director_name]').val();
		var src = "{{#each directors}}" + 
	      		  "<li><a href='#''>{{this}}</a></li>" +
	      		  "{{/each}}";


		var resultsTemplate = Handlebars.compile(src);
		$.ajax({
			url: '/api/director',
			data: {
				name: directoryParam
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
				
				if(jsonResponse.data){
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
				}
			},
			error: function (err) {

			}
		});
	});	

	//event trigger for search by title and call titles api
	$('[data-query-param="title_name"]').keyup( function (event) {

		var titleParam = $('[data-query-param=title_name]').val();
		var src = "{{#each titles}}" + 
	      		  "<li><a href='#''>{{this}}</a></li>" +
	      		  "{{/each}}";

		var resultsTemplate = Handlebars.compile(src);
		$.ajax({
			url: '/api/titles',
			data: {
				name: titleParam
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
				
				if(jsonResponse.data){
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
				}
			},
			error: function (err) {

			}
		});
	});	

	//Auto complete
	resultsContainer.on('click', 'li', function (event) {
		var title = $(event.target).text();
		$('[data-query-param="director_name"]').val(title);
		markers.forEach(function (marker) {
			if (marker.title !== title) {
				marker.setMap(null);
			}
		resultsContainer.hide();
		});
	}); 

	//switch between search by movie / director
	$("[data-contiainer='search-type']").on('click', 'li', function (event) {
		searchByMovie = $('[aria-expanded="true"]').text() ==="Movie";
		if (event.target.text == "Director" && searchByMovie) {
			$('[data-query-param=title_name]').empty();
			$('[data-query-param="title_name"]').hide();
			$('[data-query-param="director_name"]').show();
			resultsContainer.empty()
		} else if (event.target.text == "Movie" && !searchByMovie) {
			$('[data-query-param=director_name]').empty();
			$('[data-query-param="director_name"]').hide();
			$('[data-query-param="title_name"]').show();
			resultsContainer.empty()
		}
	}); 
});
