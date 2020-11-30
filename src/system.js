// TODO do all the recommender system initialization & calculation logic here
const movies = require("./content/movies.json");
const ratings = require("./content/ratings.json");
var ratingsArray;
var usersArray;

export function init() {
	// load dataset, process it, etc...
	// TODO
	ratingsArray = Object.values(ratings)
	usersArray = Object.keys(ratings)
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

	var sim = calculateSimilarity()
	console.log(sim)
}

export function calculateSimilarity() {
	let userRatings = localStorage.getItem('userRatings') ? JSON.parse(localStorage.getItem('userRatings')) : []
	if (!userRatings)
		throw new Error("The current user has not rated any movies");
	
	// Array of movie objects with user's rating will be passed
	// Use user's ratings to calculate similarity scores with other 
	// Users and make recommendations
	var simScores = [];
	for (var i = 0; i < ratingsArray.length; i++) {
		var commonMoviesUser = userRatings.filter(a => ratingsArray[i].some(b => a.id === b.id))
		var commonMoviesOther = ratingsArray[i].filter(a => userRatings.some(b => a.id === b.id))
		
		// Sort by ID, otherwise the similarity score will not be correct
		commonMoviesUser.sort(function(a, b) { 
			return a.id - b.id  ||  a.name.localeCompare(b.name);
		});
		commonMoviesOther.sort(function(a, b) { 
			return a.id - b.id  ||  a.name.localeCompare(b.name);
		});
		
		// console.log("System.calculateSimilarity() user common movies:", commonMoviesUser)
		// console.log("System.calculateSimilarity() other common movies:", commonMoviesOther)
	
		var avgRatingUser = commonMoviesUser.reduce((acc,val) =>  { return acc + val.userRating },0) / commonMoviesUser.length
		var avgRatingOther = commonMoviesOther.reduce((acc,val) =>  { return acc + val.val },0) / commonMoviesOther.length

		// console.log("System.calculateSimilarity() user average rating:", avgRatingUser)
		// console.log("System.calculateSimilarity() other average rating:", avgRatingOther)

		var numUser = commonMoviesUser.map(e => e.userRating - avgRatingUser)
		var numOther = commonMoviesOther.map(e => e.val - avgRatingOther)
	
		var numerator = 0;
	
		for (var j = 0; j < numOther.length; j++) {
			numerator += numUser[j] * numOther[j]
		}

		// console.log("System.calculateSimilarity() numerator:", numerator)

		var denUser = commonMoviesUser.map(e => (e.userRating - avgRatingUser)**2)
		var denOther = commonMoviesOther.map(e => (e.val - avgRatingOther)**2)
		
		denUser = denUser.reduce((acc,val) => { return acc + val },0)
		denOther = denOther.reduce((acc,val) => { return acc + val },0)
		
		var denominator = Math.sqrt(denOther*denUser)

		// console.log("System.calculateSimilarity() denominator:", denominator)

		var sim = numerator/denominator
		if (!sim) {
			sim = 0;
		}
		
		// console.log(`System.calculateSimilarity() Similarity between current user and user #${usersArray[i]}: ${sim}`)
		
		simScores.push(sim)
	}

	return simScores
}

export function nextBatch(batchNum) {
	// returns an array of the next `size` recommended movies
	// this function should not return previously returned movies
	// TODO
	return movies.slice((batchNum-1)*12, batchNum*12); // FIXME this is just for testing
}