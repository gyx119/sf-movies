$(document).ready(function(){
	var markers = [];
	$('[data-query-param="director_name"]').keyup( function (event) {

		var directoryParam = $('[data-query-param=director_name]').val();
		var src = "{{#each directors}}" + 
	      		"<div>{{this}}</div>" +
	      	"{{/each}}";

		var resultsTemplate = Handlebars.compile(src);
		var resultsContainer = $('[data-container=results]');
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
						    title: 'Hello World!'
						});
						markers.push(marker);
					});	
				}
			},
			error: function (err) {

			}
		});
	});	
});
