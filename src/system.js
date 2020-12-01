const movies = require("./content/movies.json");
const ratings = require("./content/ratings.json");

// INITIALIZATION LOGIC
const movieIdsToMovies = {};
for (let movie of movies)
	movieIdsToMovies[movie.id] = movie;

const avgUserRatingMap = {};
for (let userId in ratings) {
	const ratedMovies = Object.values(ratings[userId]);
	if (ratedMovies.length === 0) // shouldn't be the case, but just in case
		continue;
	avgUserRatingMap[userId] = ratedMovies.reduce((acc, rating) => acc+rating) / ratedMovies.length;
}


let userRatingsObj = {}

let cachedRatedMovies = null;
let cachedRecommendedMovies = null;


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
	let numeratorSum = 0;
	let denominatorSum1 = 0;
	let denominatorSum2 = 0;

	let totalComparedRatings = 0;
	for (let movieId in obj1) {
		if (obj2.hasOwnProperty(movieId)) {
			// these are the adjusted ratings
			const rating1 = obj1[movieId]-avg1;
			const rating2 = obj2[movieId]-avg2;

			numeratorSum += rating1*rating2;
			denominatorSum1 += Math.pow(rating1, 2);
			denominatorSum2 += Math.pow(rating2, 2);

			totalComparedRatings++;
			if (totalComparedRatings >= 50)
				break;
		}
	}

	if (denominatorSum1 === 0 || denominatorSum2 === 0) return 0;
	const result = numeratorSum/Math.sqrt(denominatorSum1*denominatorSum2);
	return Math.min(result, 1); // sometimes, the result can have precision error & be slightly larger than 1
}

function calcEstimatedRating(similarities, movieId) {
	// this is done using weighted-sum aggregation
	let numeratorSum = 0;
	let denominatorSum = 0;
	for (let simObj of similarities) {
		const userId = simObj.userId;
		const ratingData = ratings[userId];
		if (ratingData.hasOwnProperty(movieId)) {
			numeratorSum += simObj.sim * ratingData[movieId];
			denominatorSum += simObj.sim;
		}
	}
	return denominatorSum > 0 ? numeratorSum/denominatorSum : 0;
}

function calcRecommendedMovies() {
	// calculate similarities using pearson correlation coefficient
	const userRatings = Object.values(userRatingsObj);
	if (userRatings.length === 0)
		return [];

	let avgUserRating = userRatings.reduce((acc, rating) => acc+rating) / userRatings.length;

	let roundedAvgUserRating = Math.round(avgUserRating);
	if (userRatings.every(rating => rating === roundedAvgUserRating))
		return []; // no enough rating variety (all ratings are the same)

	let similarities = [];

	for (let userId in ratings) {
		const altUserRatingsObj = ratings[userId];
		let avgAltUserRating = avgUserRatingMap[userId];
		if (!avgAltUserRating)
			continue;

		const similarity = calcPearsonCorrelationCoefficient(userRatingsObj, avgUserRating, altUserRatingsObj, avgAltUserRating);
		if (similarity > 0)
			similarities.push({userId: userId, sim: similarity});
	}

	similarities.sort((a, b) => b.sim-a.sim); // sort by desc similarities
	// console.log("similarities:", similarities);
	similarities = similarities.slice(0, 20); // only use top 20 similarities

	const result = [];
	for (let movie of movies) {
		delete movie.match;
		if (!movie.userRating) {
			result.push(movie);
			movie.match = calcEstimatedRating(similarities, movie.id) / 5;
		}
	}
	result.sort((a, b) => b.match-a.match);
	// console.log("scores:", result.map(movie => movie.match));
	return result;
}

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
	// invalid caches
	cachedRatedMovies = null;
	cachedRecommendedMovies = null;
}
