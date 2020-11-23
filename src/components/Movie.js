import React from "react"
import Rating from './Rating';

export default class Movie extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: !this.props.fadein
		};
		if (this.props.fadein) {
			setTimeout(() => {
				this.setState({
					visible: true
				});
			}, this.props.fadein);
		}
	}

	render() {
		return <div className={"movie"+(!this.state.visible ? " hidden" : "")}>
			<div style={{backgroundImage: "url(https://image.tmdb.org/t/p/w400/7G9915LfUQ2lVfwMEEhDsn3kT4B.jpg)"}}>
				<div className="info">
					<div className="stats">
						<div className="similarity">98% match</div>
						<Rating movie={{averageRating: 3.5, userRating: 3}}/>
					</div>
					<h2>Toy Story <small>(1998)</small></h2>
				</div>
			</div>
		</div>;
	}
}