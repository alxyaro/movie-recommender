import React from "react";

import * as system from "../system";
import MovieListing from '../components/MovieListing';

export default class RatedPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { movies: [] };
		this.updateAndGetList = this.updateAndGetList.bind(this);
	}

	componentDidMount() {
		this.updateAndGetList();
	}

	updateAndGetList() {
		const newList = system.getRatedMovies();
		this.setState({
			movies: newList
		});
		return newList;
	}

	render() {
		return <div>
			{this.state.movies.length === 0 ?
				<p className="caption">
					You haven't rated any movies!<br/>
					Give some movie ratings within the browse tab first!
				</p> :
				<MovieListing list={this.updateAndGetList}/>
			}
		</div>
	}
}