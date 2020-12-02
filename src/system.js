const movies = require("./content/movies.json");
const ratingsMap = require("./content/ratings.json");

// INITIALIZATION LOGIC
const movieIdsToMovies = {};
for (let movie of movies)
	movieIdsToMovies[movie.id] = movie;

const avgUserRatingMap = {};
for (let userId in ratingsMap) {
	const ratedMovies = Object.values(ratingsMap[userId]);
	if (ratedMovies.length === 0) // shouldn't be the case, but just in case
		continue;
	avgUserRatingMap[userId] = ratedMovies.reduce((acc, rating) => acc+rating) / ratedMovies.length;
}


let userRatingsObj = {}
const storedRatings = sessionStorage.getItem("ratings");
if (storedRatings) {
	try {
		userRatingsObj = JSON.parse(storedRatings);
		for (let movieId in userRatingsObj) {
			movieIdsToMovies[movieId].userRating = userRatingsObj[movieId];
		}
	} catch (ignored) {}
}

let cachedRatedMovies = null;
let cachedRecommendedMovies = null;

// CORE CALCULATION LOGIC

function calcPearsonCorrelationCoefficient(obj1, avg1, obj2, avg2) {
	// it is most optimal to iterate the smallest array when we need the intersection
	let switchOrder = Object.keys(obj2).length < Object.keys(obj1).length;
	if (switchOrder) {
		let tempObj1 = obj1;
		let tempAvg1 = avg1;
		obj1 = obj2;
		avg1 = avg2;
		obj2 = tempObj1;
		avg2 = tempAvg1;
	}

	// the following 3 variables are for the pearson correlation coefficient math
	let numerator = 0;
	let denominatorSum1 = 0;
	let denominatorSum2 = 0;

	let totalComparedRatings = 0;
	for (let movieId in obj1) {
		if (obj2.hasOwnProperty(movieId)) {
			// these are the adjusted ratings
			const rating1 = obj1[movieId]-avg1;
			const rating2 = obj2[movieId]-avg2;

			numerator += rating1*rating2;
			denominatorSum1 += Math.pow(rating1, 2);
			denominatorSum2 += Math.pow(rating2, 2);

			totalComparedRatings++;
			if (totalComparedRatings >= 50)
				break;
		}
	}

	const denominator = Math.sqrt(denominatorSum1*denominatorSum2);
	if (denominator === 0) return 0;
	const result = numerator/denominator;
	return Math.min(result, 1); // sometimes, the result can have precision error & be slightly larger than 1; so cap it
}

function calcEstimatedRating(similarities, movieId) {
	// this is done using weighted-sum aggregation
	// in other words, this function gets the weighted average rating based on the ratings of the similar users
	let numerator = 0;
	let denominator = 0;
	for (let simObj of similarities) {
		const userId = simObj.userId;
		const ratingData = ratingsMap[userId];
		if (ratingData.hasOwnProperty(movieId)) {
			numerator += simObj.sim * ratingData[movieId];
			denominator += Math.abs(simObj.sim); // abs value for good measure & formula formality; negative similarities are discarded
		}
	}

	// if denominator is zero, numerator is certainly also zero
	// in general, this means that none of the similar users have rated this movie; so there is no estimate to return
	if (denominator === 0) return undefined;

	return Math.min(numerator/denominator, 5); // once again, sometimes, the result can have precision error & be slightly larger than 5; so cap it
}

function calcRecommendedMovies() {
	// calculate recommendations using pearson correlation coefficient similarity + weighted-sum aggregation estimates
	const userRatings = Object.values(userRatingsObj);
	if (userRatings.length === 0)
		return []; // no ratings; nothing to compare to

	let avgUserRating = userRatings.reduce((acc, rating) => acc+rating) / userRatings.length;

	let roundedAvgUserRating = Math.round(avgUserRating);
	if (userRatings.every(rating => rating === roundedAvgUserRating))
		return []; // not enough rating variety (all ratings are the same)

	let similarities = [];

	for (let userId in ratingsMap) {
		const altUserRatingsObj = ratingsMap[userId];
		let avgAltUserRating = avgUserRatingMap[userId];
		if (!avgAltUserRating) // just in case; all users should have at least one ratings, thus have an average rating
			continue;

		const similarity = calcPearsonCorrelationCoefficient(userRatingsObj, avgUserRating, altUserRatingsObj, avgAltUserRating);
		if (similarity > 0) // only consider positive similarities
			similarities.push({userId: userId, sim: similarity});
	}

	similarities.sort((a, b) => b.sim-a.sim); // sort similarities by desc order (most similar go first)
	// console.log("similarities:", similarities);
	similarities = similarities.slice(0, 20); // only use the top 20 similarities

	const result = [];
	for (let movie of movies) {
		delete movie.match;
		if (!movie.userRating) {
			// calculate the estimated rating for this movie
			const estimatedRating = calcEstimatedRating(similarities, movie.id);
			if (estimatedRating && estimatedRating >= 2.5) {
				// then, map this from [1, 5] to [0, 1], so it's a "recommendation match percentage"
				movie.match = (estimatedRating-1) / 4;
				result.push(movie);
			}
		}
	}
	result.sort((a, b) => b.match-a.match); // sort movies by descending matches (highest matched movies go first)
	console.log("scores:", result.map(movie => movie.match));
	return result; // enjoy
}

// EXPORTED FUNCTIONS

export function getAllMovies() {
	return movies;
}

export function getRatedMovies() {
	if (!cachedRatedMovies) {
		cachedRatedMovies = Object.keys(userRatingsObj).map(id => movieIdsToMovies[id]).sort((a, b) => b.userRating-a.userRating || a.title.localeCompare(b.title));
	}
	return cachedRatedMovies;
}

export function getRecommendedMovies() {
	if (!cachedRecommendedMovies) {
		cachedRecommendedMovies = calcRecommendedMovies();
	}
	return cachedRecommendedMovies;
}

export function ratingUpdated(movie, rating) {
	if ((movie.userRating || null) !== rating)
		throw new Error("Something is out of sync (movie.userRating != rating)");
	if (rating) {
		userRatingsObj[movie.id] = rating;
	} else {
		delete userRatingsObj[movie.id];
	}
	// invalidate caches
	cachedRatedMovies = null;
	cachedRecommendedMovies = null;

	// store ratings in sessionStorage
	sessionStorage.setItem("ratings", JSON.stringify(userRatingsObj));
}
