$(document).ready(function(){
	$('[data-query-param="director_name"]').keyup( function (event) {

		var directoryParam = $('[data-query-param=director_name]').val();
		var src = "{{#each results}}" + 
	      		"<div>" +
	      			"<span>director:{{director}}</span>" +
	      			"<span>title:{{title}}</span>" +
	      			"<span>location:{{location}}</span>" +
	  			"</tr>" +
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
					results: jsonResponse.data
				});
				resultsContainer.html(tableHtml)
			},
			error: function (err) {

			}
		});
	});	
});
