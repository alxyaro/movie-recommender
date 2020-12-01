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

export function getAllMovies() {
	return movies;
}

export function getCurrentUserRatings() {
	let currentUserRatings = localStorage.getItem('userRatings') ? JSON.parse(localStorage.getItem('userRatings')) : []
	return currentUserRatings
}

export function ratingUpdated(movie) {
	let currentUserRatings = getCurrentUserRatings()
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

	//calculateMatch()
	var sim = calculateSimilarity()
	console.log(sim)
}

export function calculateMatch(){
	var currentUserRatings = getCurrentUserRatings()
	if (!currentUserRatings)
		throw new Error("The current user has not rated any movies");
	var simScores = calculateSimilarity()
	var simScoresOrdered = simScores.slice().sort(function(a, b){return b - a});
	simScoresOrdered = simScoresOrdered.slice(0,10) //Get top 10 highest similarity scores
	console.log(simScoresOrdered)
	var simUsers = [] //Will contain the userIDs of the top 10 most similar users
	for (var i = 0; i < simScoresOrdered.length; i++) {
		simUsers.push(simScores.indexOf(simScoresOrdered[i])+2) //Find the users corresponding to the top 10 sim scores
	}
	
	var ratingsArr = ratingsArray.slice() //Create copy of ratingsArray bc we will be making changes
	/*The idea here is to loop through all the ratings and remove the ratings for any movie which has already been rated by the user
	I'm confused about how these ratings are being stored in their respective data structures so this section probably won't run
	I think that we can avoid these for loops by sending a movie object right to this function since we are calling it in ratingUpdated()
	but I dont want to fuck up this program more than I already did so I'm just goint to leave this for now
	*/
	var userRatingIDs = []
	var remainingRatings = []
	for (var i = 0; i < currentUserRatings.length; i++){
		userRatingIDs.push(currentUserRatings[i].id)
	}
	for (var i = 0; i < ratingsArr.length; i++){
		var arr = ratingsArr[i]
		for (var j = 0; j < arr.length; j++){
			for (var k = 0; k < currentUserRatings; k++){
				if (!userRatingIDs.includes(arr[j].id)){
					remainingRatings.concat([arr[j]])
				}
			}
		}
	}
	
	// arr1.concat(arr2)
	//let currentUserRatings = localStorage.setItem('userRatings') ? JSON.parse(localStorage.getItem('userRatings')) : []
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
		
		console.log("System.calculateSimilarity() user common movies:", commonMoviesUser)
		console.log("System.calculateSimilarity() other common movies:", commonMoviesOther)
	
		var avgRatingUser = commonMoviesUser.reduce((acc,val) =>  { return acc + val.userRating },0) / commonMoviesUser.length
		var avgRatingOther = commonMoviesOther.reduce((acc,val) =>  { return acc + val.val },0) / commonMoviesOther.length

		console.log("System.calculateSimilarity() user average rating:", avgRatingUser)
		console.log("System.calculateSimilarity() other average rating:", avgRatingOther)

		var numUser = commonMoviesUser.map(e => e.userRating - avgRatingUser)
		var numOther = commonMoviesOther.map(e => e.val - avgRatingOther)
	
		var numerator = 0;
	
		for (var j = 0; j < numOther.length; j++) {
			numerator += numUser[j] * numOther[j]
		}

		console.log("System.calculateSimilarity() numerator:", numerator)

		var denUser = commonMoviesUser.map(e => (e.userRating - avgRatingUser)**2)
		var denOther = commonMoviesOther.map(e => (e.val - avgRatingOther)**2)
		
		denUser = denUser.reduce((acc,val) => { return acc + val },0)
		denOther = denOther.reduce((acc,val) => { return acc + val },0)
		
		var denominator = Math.sqrt(denOther*denUser)

		console.log("System.calculateSimilarity() denominator:", denominator)

		var sim = numerator/denominator
		if (!sim) {
			sim = 0;
		}
		
		console.log(`System.calculateSimilarity() Similarity between current user and user #${usersArray[i]}: ${sim}`)
		
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
