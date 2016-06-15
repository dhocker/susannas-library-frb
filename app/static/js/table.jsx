import React from 'react';
import ReactDOM from 'react-dom';

/*
    This is the beginning of a basic React component that can render a table.
    The next step is to figure out how to make this reusable.
    After learning how modules work, we can move on to looking at
    various React datagrids and tables that can be found on GitHub.
*/

const Table = React.createClass({
    propTypes: {
        class: React.PropTypes.string.isRequired,
        cols: React.PropTypes.array.isRequired,
        url: React.PropTypes.string.isRequired
    },

    getInitialState: function(){
        return {rows: []};
    },

    componentDidMount: function() {
        this.serverRequest = $.get(this.props.url, function(response, status){
            console.log("Data rows received: " + String(response.data.length));
            this.setState({rows: response.data});
        }.bind(this));
    },

    render: function() {
        var HeaderComponents = this.generateHeaders(),
            RowComponents = this.generateRows(),
            FooterComponents = this.generateFooter();

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h2>Authors</h2>
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
    },

    generateHeaders: function() {
        var cols = this.props.cols;  // [{colname, label}]

        // generate our header (th) cell components
        var cells = cols.map(function(colData) {
            return <th key={colData.colname}>{colData.label}</th>;
        });
        // return a single header row
        return <tr>{cells}</tr>
    },

    generateRows: function() {
        var cols = this.props.cols,  // [{colname, label}]
            rows = this.state.rows;

        return rows.map(function(row) {
            // handle the column data within each row
            var cells = cols.map(function(colData) {

                // colData.colname might be "FirstName"
                return <td key={colData.colname}>{row[colData.colname]}</td>;
            });
            return <tr key={row.id}>{cells}</tr>;
        });
    },

    generateFooter: function() {
        return <tr><td>{"Total Rows"}</td><td>{this.state.rows.length}</td></tr>;
    }
});

export default Table;
