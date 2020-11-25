//import logo from './logo.svg';
import React from "react";
import Movie from "./components/Movie";

import * as system from "./system";

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			movies: system.nextBatch(12),
			myList: []
		};

		this.scrollRef = React.createRef();
		let lastLoad = 0
		window.addEventListener("scroll", e => {
			let reachedPos = window.innerHeight;
			if (reachedPos-150 > this.scrollRef.current.getBoundingClientRect().y) {
				if (Date.now()-lastLoad > 100) {
					lastLoad = Date.now();
					this.state.movies.push(...system.nextBatch(12));
					this.setState({
						movies: this.state.movies
					});
				}
			}
		});

		this.addToMyList = this.addToMyList.bind(this)
	}

	addToMyList(movie) {
		let currentUserRatings = this.state.myList
			
		let index = currentUserRatings.findIndex((e) => e.id === movie.id)
		
		if (!movie.userRating) {
			currentUserRatings.splice(index,1)
			this.setState({
				myList: currentUserRatings
			})
		}
		else if (index === -1) {
			currentUserRatings.push(movie)
			this.setState({
				myList: currentUserRatings
			})
		} else {
			currentUserRatings[index] = movie;
			this.setState({
				myList: currentUserRatings
			})
		}

		system.calculateSimilarity(this.state.myList)
	}

	render() {
		return (
			<div id="content">
				<div>
					<h3>My List</h3>
					<hr />
					<div className="movies-container">
						{this.state.myList.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={(i % 12)*100} myList={true}/> )}
					</div>
					<hr />
				</div>
				<div>
					<h3>Movies</h3>
					<hr/>
					<div className="movies-container">
						{this.state.movies.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={(i % 12)*100} addToList={this.addToMyList} />)}
					</div>
					<hr/>
				</div>
				<div id="load-delimiter" ref={this.scrollRef}/>
			</div>
		);
	}
}
