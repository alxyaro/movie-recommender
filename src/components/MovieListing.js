import React, {Component} from "react";
import Movie from './Movie';

export default class MovieListing extends Component {

	constructor(props) {
		super(props);
		this.loadPointRef = React.createRef();
		this.state = {
			loadedList: [],
			updatePending: false,
			updateBtnFadeOut: false
		};

		this.list = typeof this.props.list === "function" ? this.props.list() : this.props.list;

		this.tryLoad = this.tryLoad.bind(this);
		this.onRatingUpdateEvent = this.onRatingUpdateEvent.bind(this);
		this.updateListing = this.updateListing.bind(this);
	}

	componentDidMount() {
		document.addEventListener("scroll", this.tryLoad);
		document.addEventListener("rating-update", this.onRatingUpdateEvent);
		this.tryLoad();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.tryLoad();
	}

	componentWillUnmount() {
		document.removeEventListener("scroll", this.tryLoad);
		document.removeEventListener("rating-update", this.onRatingUpdateEvent);
	}

	tryLoad() {
		// console.log(window.innerHeight, this.loadPointRef.current.getBoundingClientRect().y)
		if (window.innerHeight >= this.loadPointRef.current.getBoundingClientRect().y) {
			let length = this.state.loadedList.length;
			if (length < this.list.length) {
				this.state.loadedList.push(...this.list.slice(length, length+15));
				this.setState({
					loadedList: this.state.loadedList
				});
			}
		}
	}

	onRatingUpdateEvent() {
		if (typeof this.props.list === "function") {
			// list prop is a function, indicating a desire in reactivity
			this.setState({
				updatePending: true
			});
		}
	}

	updateListing() {
		if (this.state.updatePending) {
			// update the list & the loadedList state
			this.list = this.props.list();
			let length = this.state.loadedList.length;
			this.setState({
				loadedList: this.list.slice(0, length),
				updatePending: false,
				updateBtnFadeOut: true
			});
			setTimeout(() => {
				this.setState({
					updateBtnFadeOut: false
				});
			}, 300);
		}
	}

	render() {
		return (
			<div>
				{this.state.updatePending || this.state.updateBtnFadeOut ? <button className={"update-button"+(this.state.updateBtnFadeOut ? " fade-out" : "")} onClick={this.updateListing}>Update List</button> : ""}
				<div className="movies-container">
					{this.state.loadedList.map(movie => <Movie key={movie.id} movie={movie} showRelevancy={this.props.showRelevancy || false}/>)}
				</div>
				<div ref={this.loadPointRef} style={{height: 1, marginTop: -420 /* 400 + 20 buffer */}}/>
			</div>
		);
	}
}