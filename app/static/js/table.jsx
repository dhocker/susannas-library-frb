/*
    flask-react - web server for learning to use react front end with Flask back end
    Copyright (C) 2016  Dave Hocker (email: AtHomeX10@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the LICENSE file for more details.

    You should have received a copy of the GNU General Public License
    along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import ReactDOM from 'react-dom';

/*
    This is the beginning of a basic React component that can render a table with actions.
    It is designed to be extended by a derived class where custom actions are defined.
    After learning how modules work, we can move on to looking at
    various React datagrids and tables that can be found on GitHub.
*/

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        // Initial state with empty rows
        this.state = {rows: []};
    }

    // Override in derived class to provide actions for table
    getActions() {
        return <td></td>
    }

    componentDidMount() {
        this.serverRequest = $.get(this.props.url, function(response, status){
            console.log("Data rows received: " + String(response.data.length));
            this.setState({rows: response.data});
        }.bind(this));
    }

    render() {
        var HeaderComponents = this.generateHeaders(),
            RowComponents = this.generateRows(),
            FooterComponents = this.generateFooter();

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h2>{this.props.title}</h2>
                </div>
                <div className="panel-body">
                    <table className={this.props.class}>
                        <thead>{HeaderComponents}</thead>
                        <tfoot>{FooterComponents}</tfoot>
                        <tbody>{RowComponents}</tbody>
                    </table>
                </div>
            </div>
        );
    }

    generateHeaders() {
        var cols = this.props.cols;  // [{colname, label}]

        // generate our header (th) cell components
        var cells = cols.map(function(colData) {
            return <th key={colData.colname}>{colData.label}</th>;
        });
        // return a single header row
        return <tr>
            {cells}
            <th>Actions</th>
            </tr>
    }

    generateRows() {
        var cols = this.props.cols,  // [{colname, label}]
            rows = this.state.rows;
        var $this = this;

        return rows.map(function(row) {
            // handle the column data within each row
            var cells = cols.map(function(colData) {

                // colData.colname might be "FirstName"
                return <td key={colData.colname}>{row[colData.colname]}</td>;
            });
            var actions = $this.getActions(row.id);
            return <tr key={row.id}>
                {cells}
                {actions}
                </tr>;
        });
    }

    generateFooter() {
        return <tr><td>{"Total Rows"}</td><td>{this.state.rows.length}</td></tr>;
    }
}

Table.propTypes = {
    title: React.PropTypes.string.isRequired,
    class: React.PropTypes.string.isRequired,
    cols: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired,
};

Table.defaultProps = {
};
