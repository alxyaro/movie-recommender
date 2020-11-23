// TODO do all the recommender system initialization & calculation logic here

export function init() {
	// load dataset, process it, etc...
	// TODO
}

export function processRating(movie, rating) {
	if (!movie)
		throw new Error("Undefined movie");
	// record user's rating for this movie (use movie.id)
	// rating may be null (if rating was removed)
	// otherwise, param rating is in [1,5]
	// TODO

}

export function nextBatch(size) {
	// returns an array of the next `size` recommended movies
	// this function should not return previously returned movies
	// TODO

}