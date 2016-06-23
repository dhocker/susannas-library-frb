import React from 'react';
import ReactDOM from 'react-dom';

/*
    This is the beginning of a basic React component that can render a select element.
    The next step is to figure out how to make this reusable.

    props
        id - element id, string
        class - element class list, string
        options - [] array/list of option values
        defaultOption - string
        onChange - event handler for selection changes

    Future changes
        Make options prop a list of objects.
        Add a new prop to specify the value field in the object.
        Add a new prop to specify the option label (human readable)
*/

export default class Select extends React.Component {
    constructor(props) {
        super(props);
        // Initial state of form inputs
        this.state = {
            selectValue: props.value ? props.value : props.defaultOption
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
            var change = {
              oldValue: this.state.selectValue,
              newValue: event.target.value
            }
            // Bubble event
            this.props.onChange(change);
        }
    }

    render() {
        var self = this;
        var options = self.props.options.map(function(optionValue) {
            return (
                <option key={optionValue} value={optionValue}>
                    {optionValue}
                </option>
            )
        });
        return (
            <select id={this.props.id}
                    className={this.props.class}
                    value={this.state.selectValue}
                    onChange={this.handleChange}>
                {options}
            </select>
        )
    }
}

Select.propTypes = {
    id: React.PropTypes.string,
    class: React.PropTypes.string,
    options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    defaultOption: React.PropTypes.string,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func
};

Select.defaultProps = {
    id: "select",
    class: "form-control"
};
