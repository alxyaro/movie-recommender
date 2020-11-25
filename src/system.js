// TODO do all the recommender system initialization & calculation logic here
const movies = require("./content/movies.json");
const ratings = require("./content/ratings.json");

export function init() {
	// load dataset, process it, etc...
	// TODO
}

export function ratingUpdated(movie) {
	let currentUserRatings = localStorage.getItem('userRatings') ? JSON.parse(localStorage.getItem('userRatings')) : []
	console.log(currentUserRatings)	

	let index = currentUserRatings.findIndex((e) => e.id === movie.id)
	
	if (!movie.userRating) {
		currentUserRatings.splice(index,1)
		localStorage.setItem('userRatings', JSON.stringify(currentUserRatings))
	}
	else if (index === -1) {
		currentUserRatings.push(movie)
		localStorage.setItem('userRatings', JSON.stringify(currentUserRatings))
	} else {
		currentUserRatings[index] = movie;
		localStorage.setItem('userRatings', JSON.stringify(currentUserRatings))
	}

	calculateSimilarity()
}

export function calculateSimilarity() {
	let userRatings = localStorage.getItem('userRatings') ? JSON.parse(localStorage.getItem('userRatings')) : []
	if (!userRatings)
		throw new Error("The current user has not rated any movies");
	
	// Array of movie objects with user's rating will be passed
	// Use user's ratings to calculate similarity scores with other 
	// Users and make recommendations
	var i;
	var ratingsArray = Object.values(ratings)
	for (i = 0; i < ratingsArray.length; i++) {
		console.log("Ratings Array:", ratingsArray[i])
		var commonMoviesOther = ratingsArray[i].filter(a => userRatings.some(b => a.id === b.id))
		var commonMoviesUser = userRatings.filter(a => ratingsArray[i].some(b => a.id === b.id))
		
		var avgRatingOther = commonMoviesOther.reduce((acc,val) =>  { return acc + val.val },0) / commonMoviesOther.length
		var avgRatingUser = commonMoviesUser.reduce((acc,val) =>  { return acc + val.userRating },0) / commonMoviesUser.length
		console.log("AVG RATING OTHER:", avgRatingOther)
		console.log("AVG RATING OTHER:", avgRatingUser)
	}
	
}

export function nextBatch(size) {
	// returns an array of the next `size` recommended movies
	// this function should not return previously returned movies
	// TODO
	return movies.slice(0, size); // FIXME this is just for testing
}