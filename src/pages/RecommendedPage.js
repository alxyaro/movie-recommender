import React from "react";
import Movie from "../components/Movie";

import * as system from "../system";
// TO DO
export default class RecommendedPage extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
			recommendations: system.getCurrentUserRatings(), // change this to call function that returns list of movies
		};
	}

	render() {
		return (
			<div>
				{this.state.recommendations.length === 0 ? <p className="caption">Give a rating in the movies tab to find your next pick for movie night!<br/>Our algorithm will recommend movies based on your past ratings in relation to the taste of other users.</p> : ""}
				<div className="movies-container">
					{this.state.recommendations.length > 0 ? this.state.recommendations.map((movie, i) => <Movie key={movie.id} movie={movie} match={movie.match} fadein={(i % 12)*100} />) : ""}
				</div>
			</div>
		);
	}
}