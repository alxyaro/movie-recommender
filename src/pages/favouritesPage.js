//import logo from './logo.svg';
import React from "react";
import Movie from "../components/Movie";

import * as system from "../system";

export default class FavouritesPage extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
			favourites: system.getCurrentUserRatings(),
		};
	}

	render() {
		return (
			<div className="movies-container">
				{this.state.favourites.length > 0 ? this.state.favourites.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={(i % 12)*100} />) : <h1>To add to Favourites, give a rating to a movie in the movies tab.</h1>}
			</div> 
		);
	}
}