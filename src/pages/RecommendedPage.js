import React from "react";

import * as system from "../system";
import MovieListing from '../components/MovieListing';

export default class RecommendedPage extends React.Component {
	render() {
		const movies = system.getRecommendedMovies();
		return <div>
			{movies.length === 0 ?
				<p className="caption">
					Give a variety of ratings in the browse tab to get some recommendations!<br/>
					Our algorithm will recommend movies based on your past ratings in relation to the taste of other users.
				</p> :
				<MovieListing list={movies} showMatchPct={true}/>
			}
		</div>;
	}
}