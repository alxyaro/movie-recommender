import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Pages
import MoviesPage from './pages/moviesPage';
import FavouritesPage from './pages/favouritesPage';
import RecommendedPage from './pages/recommendedPage';

export default class App extends React.Component {
	render() {
		return (
			<div id="content">
				<Router>
					<div className="page-selector">
						<Link to="/"><button className="page-select">Movies</button></Link>
						<Link to="/favourites"><button className="page-select">Favourites</button></Link>
						<Link to="/recommended"><button className="page-select">Recommended</button></Link>
					</div>
					<hr/>
						<Route exact path="/" component={MoviesPage} />
						<Route exact path="/favourites" component={FavouritesPage} />
						<Route exact path="/recommended" component={RecommendedPage} />
					<hr/>
				</Router>
			</div>
		);
	}
}
