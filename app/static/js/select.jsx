/*
    Susanna's New Library
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

/*
    This is a basic React component that can render a select element.

    props
        id - Select element id, string
        selectClass - select element class list, string
        optionClass - option element class list to be applied to each option in select list. String.
        options - [{}...{}] array/list of objects containing at least a key/value pair
        keyProp - name of key property in option list
        valueProp - name of value property in option list
        labelProp - name of label property in option list. Can be the same as the value.
        defaultValue - the initial value of the select, string
        onChange(event) - event handler for selection changes. The event is an object
            with oldValue and newValue properties.
*/

export default class Select extends React.Component {
    constructor(props) {
        super(props);
        // Initial state of form inputs
        this.state = {
            selectValue: props.defaultValue ? props.defaultValue : props.options[0][props.valueProp]
        };
        this.handleChange = this.handleChange.bind(this);
        this.setSelectedOption = this.setSelectedOption.bind(this);
    }

    setSelectedOption(value) {
        this.setState({selectValue: value});
    }

    handleChange(event) {
        this.setState({selectValue: event.target.value});
        if (this.props.onChange) {
            const change = {
                oldValue: this.state.selectValue,
                newValue: event.target.value
            };
            // Bubble event
            this.props.onChange(change);
        }
    }

    render() {
        const self = this;
        const options = self.props.options.map(function (optionValue) {
            return (
                <option
                    key={optionValue[self.props.keyProp]}
                    className={self.props.optionClass}
                    value={optionValue[self.props.valueProp]}
                >
                    {optionValue[self.props.labelProp]}
                </option>
            );
        });
        return (
            <select
                id={this.props.id}
                className={this.props.selectClass}
                value={this.state.selectValue}
                onChange={this.handleChange}
            >
                {options}
            </select>
        );
    }
}

Select.propTypes = {
    id: PropTypes.string,
    selectClass: PropTypes.string,
    optionClass: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultValue: PropTypes.string,
    keyProp: PropTypes.string.isRequired,
    valueProp: PropTypes.string.isRequired,
    labelProp: PropTypes.string.isRequired,
    onChange: PropTypes.func
};

Select.defaultProps = {
    id: "select",
    selectClass: "form-control",
    optionClass: ""
};
