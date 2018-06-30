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
import PropTypes from 'prop-types';
import Select from './select';

/*
    Implements a select element for all of the avaliable categories
    in the categories table. Uses the Select component to generate
    the actual element. This is implementation by composition as
    opposed to by derivation from the Select component.
*/

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
        this.selectInstance.setSelectedOption(value);
    }

    resetSelectedCategory() {
        this.setState({categoryValue: this.props.defaultValue});
        this.selectInstance.setSelectedOption(this.props.defaultValue);
    }

    loadCategories() {
        // Retrieve all of the categories
        console.log("Getting all categories from url " + this.props.url);
        const $this = this;
        $.get(this.props.url, function (response /* , status */) {
            console.log("Category rows received: " + String(response.data.rows.length));
            const rows = response.data.rows;
            $this.setState({
                category_rows: rows,
                categoryValue: $this.state.categoryValue
            });
        });
    }

    componentDidMount() {
        if (this.state.category_rows.length === 0) {
            this.loadCategories();
        }
    }

    categoryChanged(event) {
        this.setState({categoryValue: event.newValue});
        if (this.props.onChange) {
            const change = {
                oldValue: this.state.categoryValue,
                newValue: event.newValue
            };
            // Bubble event
            this.props.onChange(change);
        }
    }

    /*
        Generate a select element for the categories
    */
    render() {
        /*
            Select properties
            id - Select element id, string
            selectClass - select element class list, string
            optionClass - option element class list to be applied to each option
                in select list. String.
            options - [{}...{}] array/list of objects containing at least a key/value pair
            keyProp - name of key property in option list
            valueProp - name of value property in option list
            labelProp - name of label property in option list. Can be the same as the value.
            defaultValue - the initial value of the select, string
            onChange(event) - event handler for selection changes. The event is an object
        */
        return (
            <Select
                id={this.props.id}
                selectClass={"form-control"}
                options={this.state.category_rows}
                keyProp={"id"}
                valueProp={"id"}
                labelProp={"name"}
                defaultValue={"1"}
                onChange={this.categoryChanged}
                ref={(instance) => {
                    this.selectInstance = instance;
                }}
            />
        );
    }
}

SelectCategory.propTypes = {
    id: PropTypes.string.isRequired,
    defaultValue: PropTypes.number,
    url: PropTypes.string,
    onChange: PropTypes.func
};

SelectCategory.defaultProps = {
    url: "/categories",
    defaultValue: 1
};
