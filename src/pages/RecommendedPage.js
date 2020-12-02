import React from "react";

import * as system from "../system";
import MovieListing from '../components/MovieListing';

export default class RecommendedPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { movies: [] };
		this.updateAndGetList = this.updateAndGetList.bind(this);
	}

	componentDidMount() {
		this.updateAndGetList();
	}

	updateAndGetList() {
		const newList = system.getRecommendedMovies();
		this.setState({
			movies: newList
		});
		return newList;
	}

	render() {
		return <div>
			{this.state.movies.length === 0 ?
				<p className="caption">
					You haven't given enough ratings to get any recommendations! <br/>
					Give some movie ratings within the browse tab first!
				</p> :
				<MovieListing list={this.updateAndGetList} showRelevancy={true}/>
			}
		</div>;
	}
}