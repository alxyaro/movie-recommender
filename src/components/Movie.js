import React from "react"
import Rating from './Rating';

export default class Movie extends React.Component {
	render() {
		return <div className="movie">
			<div style={{backgroundImage: "url(https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg)"}}>
				<div className="info">
					<Rating movie={{averageRating: 3.5, userRating: 3}}/>
					<h2>Toy Story (1998)</h2>
				</div>
			</div>
		</div>;
	}
}