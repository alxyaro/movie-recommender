//import logo from './logo.svg';
import React from "react";
import Movie from "../components/Movie";

import * as system from "../system";

export default class FavouritesPage extends React.Component {
	constructor(props) {
        super(props);
        
        let batchNum = 1;

		this.state = {
			favourites: system.getCurrentUserRatings(),
		};
		batchNum += 1;

		this.scrollRef = React.createRef();
		let lastLoad = 0
		
		window.addEventListener("scroll", e => {
			let reachedPos = window.innerHeight;
			if (reachedPos-150 > this.scrollRef.current.getBoundingClientRect().y) {
				if (Date.now()-lastLoad > 100) {
					lastLoad = Date.now();
					this.state.movies.push(...system.nextBatch(batchNum));
					batchNum += 1;
					this.setState({
						movies: this.state.movies
					});
				}
			}
		});
	}

	render() {
		return (
            this.state.favourites ? this.state.favourites.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={(i % 12)*100} />) : "To add favourites, give a rating to a movie in the movies tab."
		);
	}
}