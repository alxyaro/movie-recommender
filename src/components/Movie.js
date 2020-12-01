import React from "react"
import Rating from './Rating';

export default class Movie extends React.Component {
	render() {
		return <div className="movie">
			<div style={{backgroundImage: "url(https://image.tmdb.org/t/p/w400/"+this.props.movie.tmdbImg+")"}}>
				<div className="info">
					<div className="stats">
						<div className="similarity">{this.props.match}</div>
						{this.props.myList ? "" : <Rating movie={this.props.movie} addToList={this.props.addToList}/>}
					</div>
					<h2>
						{this.props.movie.title}
					</h2>
				</div>
			</div>
		</div>;
	}
}