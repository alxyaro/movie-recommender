import React from "react";

import * as system from "../system";
import MovieListing from '../components/MovieListing';

export default class RecommendedPage extends React.Component {
	render() {
		const movies = system.getRecommendedMovies();
		return <div>
			{movies.length === 0 ?
				<p className="caption">
					Give a rating in the browse tab to find your next pick for movie night!<br/>
					Our algorithm will recommend movies based on your past ratings in relation to the taste of other users.
				</p> :
				<MovieListing list={movies}/>
			}
		</div>;
	}
}