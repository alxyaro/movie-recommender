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

	let currUserMoviesRated = userRatings.map(e => e.id)
	
	// Average rating for current user
	var avgCurrUserMoviesRated = userRatings.reduce(function(acc, movie) {
		return acc + movie.userRating
	},0) / userRatings.length

	let usersArray = Object.keys(ratings)
	let usersRatingsArray = Object.values(ratings)
	console.log("Array of user ID's:", usersArray)
	console.log("Array of user Ratings:", usersRatingsArray)
	var moviesRated = [];


	var i;
	for (i = 0; i < usersArray.length; i++) {
		// For each user and their ratings, get intersection with current user
		moviesRated = Object.keys(usersRatingsArray[i])
		// Common movies will be an intersection of movies that both users have rated in common
		let commonMovies = moviesRated.filter((e) => currUserMoviesRated.indexOf(e) !== -1)
		
	}
}

export function nextBatch(size) {
	// returns an array of the next `size` recommended movies
	// this function should not return previously returned movies
	// TODO
	return movies.slice(0, size); // FIXME this is just for testing
}