import React from "react";
import * as system from "../system"

export default class Rating extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hoveringOn: undefined,
			userValue: this.props.movie?.userRating || null
		};
		this.defaultValue = 0;
	}
	onMouseEnter(pos) {
		this.setState({
			hoveringOn: pos
		});
	}
	onMouseLeave() {
		this.setState({
			hoveringOn: undefined
		});
	}
	setRating(rating) {
		rating = rating === this.state.userValue ? null : rating;
		if (rating != null)
			this.props.movie.userRating = rating;
		else
			delete this.props.movie.userRating;
		system.ratingUpdated(this.props?.movie || undefined, rating)
		this.setState({
			userValue: rating
		});
		// TO DO: Update user rating in userRating.json for this movie
		if (localStorage.getItem('userRatings') !== null) {
			let currentRatings = JSON.parse(localStorage.getItem('userRatings'))
			currentRatings[1][this.props.movie.id] = {"val": rating, "time": Date.now()}
			localStorage.setItem('userRatings', JSON.stringify(currentRatings))
		}
		else {
			localStorage.setItem('userRatings', JSON.stringify({1: { [this.props.movie.id]: {"val": rating, "time": Date.now()}}}))
		}
	}
	render() {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			let classes = "star";
			if (this.defaultValue) {
				if (Math.ceil(this.defaultValue) >= i) {
					if (this.defaultValue < i) {
						classes += " half";
					} else {
						classes += " full";
					}
				}
			}
			if (this.state.hoveringOn) {
				if (this.state.hoveringOn >= i)
					classes += " active";
			} else if (this.state.userValue && this.state.userValue >= i) {
				classes += " active";
			}
			stars.push(<div
				key={i}
				className={classes}
				onMouseEnter={this.onMouseEnter.bind(this, i)}
				onMouseLeave={this.onMouseLeave.bind(this)}
				onClick={this.setRating.bind(this, i)}>
				{}
			</div>);
		}
		return (
			<div className="rating">{stars}</div>
		);
	}
}