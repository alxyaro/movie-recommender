//import logo from './logo.svg';
import React from "react";
import Movie from "./components/Movie";

import * as system from "./system";

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			movies: system.nextBatch(12)
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
	}

	render() {
		return (
			<div id="content">
				<header className="App-header">
					My List
				</header>
				<div className="movies-container">
					{this.state.movies.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={(i % 12)*100}/>)}
				</div>
				<div id="load-delimiter" ref={this.scrollRef}/>
			</div>
		);
	}
}
