//import logo from './logo.svg';
import Movie from './components/Movie';

function App() {
	return (
		<div id="content">
			<header className="App-header">
				{/*<img src={logo} className="App-logo" alt="logo"/>*/}
			</header>
			<div className="movies-container">
				<Movie fadein={100}/>
				<Movie fadein={200}/>
				<Movie fadein={300}/>
				<Movie fadein={400}/>
			</div>
		</div>
	);
}

export default App;
