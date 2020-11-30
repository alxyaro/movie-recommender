import React from "react";
import Movie from "../components/Movie";

import * as system from "../system";
// TO DO
export default class RecommendedPage extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
			recommendations: system.getCurrentUserRatings(),
		};
	}

	render() {
		return (
			<div className="movies-container">
				{this.state.recommendations.length > 0 ? this.state.favourites.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={(i % 12)*100} />) : <h1>Our algorithm will provide recommended movies based off of movies you have enjoyed. <br/> <br/> Give a rating in the movies tab to find your next pick for movie night.</h1>}
			</div> 
		);
	}
}