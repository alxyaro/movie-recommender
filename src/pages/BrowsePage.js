import React from "react";

import * as system from "../system";
import MovieListing from '../components/MovieListing';

export default class BrowsePage extends React.Component {
	render() {
		return <MovieListing list={system.getAllMovies()}/>;
	}
}