import React from "react"

export default class MovieComponent extends React.Component {
	render() {
		return <div className="movie">
			<div style={{backgroundImage: "url(https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg)"}}>
				<div className="info">
					<h2>Toy Story (1998)</h2>
				</div>
			</div>
		</div>;
	}
}