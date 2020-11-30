import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

// Pages
import MoviesPage from './pages/MoviesPage';
import FavouritesPage from './pages/FavouritesPage';
import RecommendedPage from './pages/RecommendedPage';

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<nav>
					<dic className="wrapper">
						<NavLink exact={true} to="/"><button className="page-select">Movies</button></NavLink>
						<NavLink to="/favourites"><button className="page-select">Favourites</button></NavLink>
						<NavLink to="/recommended"><button className="page-select">Recommended</button></NavLink>
					</dic>
				</nav>
				<div className="wrapper">
					<Route exact path="/" component={MoviesPage} />
					<Route exact path="/favourites" component={FavouritesPage} />
					<Route exact path="/recommended" component={RecommendedPage} />
				</div>
			</Router>
		);
	}
}
