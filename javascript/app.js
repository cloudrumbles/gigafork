var ingredients = [];

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

function displayRecipes() {
	$.ajax({
		url: 'https://api.edamam.com/search?q=' + ingredients + '&app_id=b8fa8ec0&app_key=2e99e135530eaed01cb9620b24c1f1c0'
	}).then(function(response) {
    console.log(response);
		// var intCalories = (response.hits[0].recipe.calories)/(response.hits[0].recipe.yield);
		// var calories = (Math.floor(intCalories));
		var results = response.hits;

		$('#recipeDisplay').html('');

		for (i = 0; i < results.length; i++) {
			var intCalories = (results[i].recipe.calories)/(results[i].recipe.yield);
			var calories = (Math.floor(intCalories));
			var recipeDiv = $('<div>');
			var recipeImage = $('<img>');
			var recipeCaption = $('<div>');
			var recipeBtnDiv = $('<div>');
			var caloriesP = $('<p>');
			recipeCaption.addClass('caption');
			recipeCaption.append($('<div>').text(results[i].recipe.label).addClass('recipeName'));
			recipeCaption.addClass('text-center');
			caloriesP.text(calories + ' calories per serving');
			recipeCaption.append(caloriesP)
			recipeBtnDiv.append($('<a>').append($('<button>').addClass('btn recipeBtn').text('Go to recipe')).attr('href',results[i].recipe.url).attr('target','_blank'));
			recipeCaption.append(recipeBtnDiv);
			recipeImage.attr('src', results[i].recipe.image);
			recipeDiv.addClass('thumbnail col-md-4 recipe');
			recipeDiv.append(recipeImage);
			recipeDiv.append(recipeCaption);
			$('#recipeDisplay').prepend(recipeDiv);

		};
		$('#numIngredients').html(ingredients.length);
		for (var j = 0; j < ingredients.length; j++) {
			var ingredientDiv = $('<div>').text(ingredients[j]).addClass('currentIngredient');
			var ingredientClose = $('<button>').text('X').addClass('ingredientListBtn btn').attr('name', ingredients[j]);
			ingredientDiv.append(ingredientClose);
			$('#ingredients-list').prepend(ingredientDiv);
		};
	});
};

$('#ingredientsSearchBtn').on('click', function(event){
	event.preventDefault();
	var ingredient = $('#ingredientsSearchBar').val().trim();
	var ingredientStr = String(ingredient);
	ingredients.push(ingredient);
	$('#ingredientsSearchBar').val('');
	$('#ingredients-list').empty();
	displayRecipes();
	console.log(ingredients);
});

$(document).on('click', '.ingredientListBtn', function() {
	var search_term = this.name;

	for (var i=ingredients.length-1; i>=0; i--) {
    	if (ingredients[i] === search_term) {
        ingredients.splice(i, 1);
         break;
    	};
	};
	console.log(ingredients)
	$('#ingredients-list').empty();
	$('#recipeDisplay').empty();
	if (ingredients.length >= 1) {
	displayRecipes();
	}
  else {
    // alert("Please enter at least one ingredient.");
		// $('#numIngredients').html('0');
		// var recipeBckGound = $('<img>').attr('src', 'images/MainPic.jpg').addClass('recipeDisplayBckGround img-responsive');
		// $('#recipeDisplay').append(recipeBckGound);
	};
});
