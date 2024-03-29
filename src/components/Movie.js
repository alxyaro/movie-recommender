import React from "react"
import Rating from './Rating';

export default class Movie extends React.Component {
	render() {
		return <div className="movie">
			<div style={{backgroundImage: "url(https://image.tmdb.org/t/p/w400/"+this.props.movie.tmdbImg+")"}}>
				<div className="info">
					<a className="info-link" href={"https://www.themoviedb.org/movie/"+this.props.movie.id} target="_blank" rel="noreferrer">More Info</a>
					<div className="stats">
						{this.props.showRelevancy ? <div className="similarity">{Math.floor(this.props.movie.match*100)}% Match</div> : ""}
						{this.props.myList ? "" : <Rating movie={this.props.movie} addToList={this.props.addToList} showAvg={/*this.props.showRelevancy*/false}/>}
					</div>
					<h2>
						{this.props.movie.title} <small>({this.props.movie.releaseDate.y})</small>
					</h2>
				</div>
			</div>
		</div>;
	}
}