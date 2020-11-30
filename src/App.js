//import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Pages
import MoviesPage from './pages/moviesPage';
import FavouritesPage from './pages/favouritesPage';

import * as system from "./system";

export default class App extends React.Component {
	constructor(props) {
		super(props);

		let batchNum = 1;

		this.state = {
			movies: system.nextBatch(batchNum),
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
			<div id="content">
				<Router>
					<div className="page-selector">
						<Link to="/"><button className="page-select">Movies</button></Link>
						<Link to="/favourites"><button className="page-select">Favourites</button></Link>
						<Link to="/recommented"><button className="page-select">Recommended</button></Link>
					</div>
					<hr/>
					<div className="movies-container">
						<Route exact path="/" component={MoviesPage} />
						<Route exact path="/favourites" component={FavouritesPage} />
					</div>
					<hr/>
				</Router>
				<div id="load-delimiter" ref={this.scrollRef}/>
			</div>
		);
	}
}
