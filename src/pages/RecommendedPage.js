import React from "react";

import * as system from "../system";
import MovieListing from '../components/MovieListing';

export default class RecommendedPage extends React.Component {
	constructor(props) {
		super(props);
		// set this in the constructor, so it's not called again during routine re-renders
		this.movies = system.getRecommendedMovies();
	}

	render() {
		return <div>
			{this.movies.length === 0 ?
				<p className="caption">
					Give a variety of ratings in the browse tab to get some recommendations!<br/>
					Our algorithm will recommend movies based on your past ratings in relation to the taste of other users.
				</p> :
				<MovieListing list={this.movies} showRelevancy={true}/>
			}
		</div>;
	}
}