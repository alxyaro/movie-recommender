import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

// Pages
import MoviesPage from './pages/MoviesPage';
import FavouritesPage from './pages/FavouritesPage';
import RecommendedPage from './pages/RecommendedPage';

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			navHidden: false
		};

		let lastScrollY = 0;
		document.addEventListener("scroll", e => {
			let hidden = window.scrollY > 60 && window.scrollY-lastScrollY > 0;
			if (this.state.navHidden !== hidden) {
				this.setState({
					navHidden: hidden
				});
			}
			lastScrollY = window.scrollY;
		});
	}

	render() {
		return (
			<Router>
				<nav className={this.state.navHidden ? "hidden" : ""}>
					<div className="wrapper">
						<NavLink exact={true} to="/"><button className="page-select">Movies</button></NavLink>
						<NavLink to="/favourites"><button className="page-select">Favourites</button></NavLink>
						<NavLink to="/recommended"><button className="page-select">Recommended</button></NavLink>
					</div>
				</nav>
				<div className="wrapper" style={{marginTop: 70}}>
					<Route exact path="/" component={MoviesPage} />
					<Route exact path="/favourites" component={FavouritesPage} />
					<Route exact path="/recommended" component={RecommendedPage} />
				</div>
			</Router>
		);
	}
}
