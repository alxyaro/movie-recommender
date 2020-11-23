//import logo from './logo.svg';
import Movie from './components/Movie';

function App() {
	return (
		<div id="content">
			<header className="App-header">
				{/*<img src={logo} className="App-logo" alt="logo"/>*/}
			</header>
			<div className="movies-container">
				<Movie/>
				<Movie/>
				<Movie/>
				<Movie/>
			</div>
		</div>
	);
}

export default App;
