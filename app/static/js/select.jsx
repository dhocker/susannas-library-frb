import React from 'react';

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
    id: React.PropTypes.string,
    selectClass: React.PropTypes.string,
    optionClass: React.PropTypes.string,
    options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    defaultValue: React.PropTypes.string,
    keyProp: React.PropTypes.string.isRequired,
    valueProp: React.PropTypes.string.isRequired,
    labelProp: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func
};

Select.defaultProps = {
    id: "select",
    selectClass: "form-control",
    optionClass: ""
};
