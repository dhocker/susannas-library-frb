/*
    React + Bootstrap select category component
    Copyright © 2016  Dave Hocker (email: AtHomeX10@gmail.com)

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

export default class SelectCategory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryValue: props.defaultValue,
            category_rows: []
        };

        this.setSelectedCategory = this.setSelectedCategory.bind(this);
        this.getSelectedCategory = this.getSelectedCategory.bind(this);
        this.resetSelectedCategory = this.resetSelectedCategory.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.loadCategories = this.loadCategories.bind(this);
        this.categoryChanged = this.categoryChanged.bind(this);
    }

    getSelectedCategory() {
        return this.state.categoryValue;
    }

    setSelectedCategory(value) {
        this.setState({categoryValue: value});
    }

    resetSelectedCategory() {
        this.setState({categoryValue: this.props.defaultValue});
    }

    loadCategories() {
        // Retrieve all of the categories
        console.log("Getting all categories from url " + this.props.url);
        var $this = this;
        $.get(this.props.url, function(response, status){
            console.log("Category rows received: " + String(response.data.rows.length));
            var rows = response.data.rows;
            $this.setState({
                category_rows: rows,
                categoryValue: $this.state.categoryValue
            });
        });
    }

    componentDidMount() {
        if (this.state.category_rows.length == 0) {
            this.loadCategories();
        }
    }

    categoryChanged(event) {
        this.setState({categoryValue: event.target.value});
        if (this.props.onChange) {
            var change = {
              oldValue: this.state.categoryValue,
              newValue: event.target.value
            }
            // Bubble event
            this.props.onChange(change);
        }
    }

    /*
        Generate a select element for the categories
    */
    render() {
        var options_list = this.state.category_rows;
        var option_elements = options_list.map(function(optionValue) {
            return (
                <option key={optionValue.id} value={optionValue.id}>
                    {optionValue.name}
                </option>
            )
        });
        return (
            <select id={this.props.id}
                    className={"form-control"}
                    value={this.state.categoryValue}
                    onChange={this.categoryChanged}>
                {option_elements}
            </select>
        )
    }
}

SelectCategory.propTypes = {
    id: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.number,
    url: React.PropTypes.string,
    onChange: React.PropTypes.func
};

SelectCategory.defaultProps = {
    url: "/categories",
    defaultValue: 1
};
