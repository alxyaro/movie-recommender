import React, {Component} from "react";
import Movie from './Movie';

export default class MovieListing extends Component {

	constructor(props) {
		super(props);
		this.loadPointRef = React.createRef();
		this.state = {
			loadedList: []
		};

		this.tryLoad = this.tryLoad.bind(this);
	}

	componentDidMount() {
		document.addEventListener("scroll", this.tryLoad);
		this.tryLoad();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.tryLoad();
	}

	componentWillUnmount() {
		document.removeEventListener("scroll", this.tryLoad);
	}

	tryLoad() {
		// console.log(window.innerHeight, this.loadPointRef.current.getBoundingClientRect().y)
		if (window.innerHeight >= this.loadPointRef.current.getBoundingClientRect().y) {
			let length = this.state.loadedList.length;
			if (length < this.props.list.length) {
				this.state.loadedList.push(...this.props.list.slice(length, length+15));
				this.setState({
					loadedList: this.state.loadedList
				});
			}
		}
	}

	render() {
		return (
			<div>
				<div className="movies-container">
					{this.state.loadedList.map(movie => <Movie key={movie.id} movie={movie}/>)}
				</div>
				<div ref={this.loadPointRef} style={{height: 1, marginTop: -420 /* 400 + 20 buffer */}}/>
			</div>
		);
	}
}