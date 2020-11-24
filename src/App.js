//import logo from './logo.svg';
import {Component} from "react";
import Movie from "./components/Movie";

import * as system from "./system";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			movies: system.nextBatch(12)
		};
	}

	render() {
		return (
			<div id="content">
				<header className="App-header">
					{/*<img src={logo} className="App-logo" alt="logo"/>*/}
				</header>
				<div className="movies-container">
					{this.state.movies.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={i*100}/>)}
				</div>
			</div>
		);
	}
}
