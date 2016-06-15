import React from 'react';
import ReactDOM from 'react-dom';
import Table from './table';

/*
    This is the beginning of a basic React componet that can render a table.
    The next step is to figure out how to make this reusable.
    After learning how modules work, we can move on to looking at
    various React datagrids and tables that can be found on GitHub.
*/

/*
    This is a somewhat awkward way to expose a function
    so it can be called from an html page.
    But, it does work.
window.initHomePage = initHomePage
*/

/*
    Another low quality way to execute page-specific code.
    This one depends on using well-known element id's.
    The existence of a given element id triggers its init code.
if ($('#reacttable').length > 0) {
    initHomePage();
}
else {
    console.log("This is not the home page");
}

export class App extends React.Component {
	render() {
		return (
			<div>Simple React + Babel + Webpack</div>
		);
	}
}

console.log("Attempting to create App");
ReactDOM.render(<App/>, document.querySelector("#reacttable"));

*/