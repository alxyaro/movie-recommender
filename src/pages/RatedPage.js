import React from "react";

import * as system from "../system";
import MovieListing from '../components/MovieListing';

export default class RatedPage extends React.Component {
	render() {
		const movies = system.getRatedMovies();
		return <div>
			{movies.length === 0 ?
				<p className="caption">
					You haven't rated any movies!<br/>Give some ratings within the the browse tab first!
				</p> :
				<MovieListing list={system.getRatedMovies()}/>
			}
		</div>
	}
}