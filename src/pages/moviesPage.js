import React from "react";
import Movie from "../components/Movie";

import * as system from "../system";

let batchNum = 1;

export default class MoviesPage extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			movies: system.nextBatch(batchNum),
		};
		
		this.scrollRef = React.createRef();
		this.scrollFunction = this.scrollFunction.bind(this)
		window.addEventListener("scroll", this.scrollFunction)
	}

	componentDidMount() {
		batchNum = 1;
		this.setState({
			movies: system.nextBatch(batchNum)
		})
		batchNum += 1;
	};

	componentWillUnmount() {
		window.removeEventListener("scroll", this.scrollFunction)
	}

	scrollFunction() {
		let lastLoad = 0
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
	}

	render() {
		return (
			<div>
				<div className="movies-container">
					{console.log(this.state.movies)}
					{this.state.movies.map((movie, i) => <Movie key={movie.id} movie={movie} fadein={(i % 12)*100} />)}
				</div>
				<div id="load-delimiter" ref={this.scrollRef}/>
			</div>
		
		);
	}
}