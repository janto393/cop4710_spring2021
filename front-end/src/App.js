// React imports
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';

class App extends React.Component
{
	render()
	{
		return (
			<Router>
				<Switch>
					<Route path="/" exact>
						<LoginPage />
					</Route>
				</Switch>
			</Router>
		)
	}
}

export default App;
