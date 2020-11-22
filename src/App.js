//import logo from './logo.svg';
import MovieComponent from './MovieComponent';

function App() {
	return (
		<div id="content">
			<header className="App-header">
				{/*<img src={logo} className="App-logo" alt="logo"/>*/}
			</header>
			<div className="movies-container">
				<MovieComponent/>
				<MovieComponent/>
				<MovieComponent/>
				<MovieComponent/>
			</div>
		</div>
	);
}

export default App;
