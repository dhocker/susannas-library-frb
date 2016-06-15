import React from 'react';
import ReactDOM from 'react-dom';
import Select from './select';

/*
    This is the beginning of a basic React componet that can render a form.
    The next step is to figure out how to make this reusable.
*/

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        // Initial state of form inputs
        this.state = {
            helloValue: "",
            worldValue: "",
            checkValue: false,
            optionValue: 'option1',
            selectValue: "3"
        };
        this.helloChanged = this.helloChanged.bind(this);
        this.worldChanged = this.worldChanged.bind(this);
        this.save = this.save.bind(this);
        this.checkChanged = this.checkChanged.bind(this);
        this.optionChanged = this.optionChanged.bind(this);
        this.selectChanged = this.selectChanged.bind(this);
    }

    helloChanged(event) {
        this.state['helloValue'] = event.target.value;
    }

    worldChanged(event) {
        this.state['worldValue'] = event.target.value;
    }

    checkChanged(event) {
        this.setState({checkValue: !this.state.checkValue});
    }

    optionChanged(event) {
        this.setState({optionValue: event.target.value});
    }

    selectChanged(event) {
        this.setState({selectValue: event.newValue});
    }

    save(event) {
        console.log(this.state['helloValue']);
        console.log(this.state['worldValue']);
        console.log(this.state['checkValue']);
        console.log(this.state['optionValue']);
        console.log(this.state['selectValue']);
        var data = {
            hello: this.state.helloValue,
            world: this.state.worldValue,
            checked: this.state.checkValue,
            option: this.state.optionValue,
            select: this.state.selectValue
        };
        // The data object will be request.form on the server
        this.serverRequest = $.ajax({
            type: "PUT",
            url: "/formdata",
            data: data,
            success: function(result){
                console.log(result);
            }
        })
    }

    render() {
        return (
            <form role="form">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h2>Form Heading</h2>
                    </div>
                    <div className="panel-body">
                        <div className="form-group">
                            <label for="hello">Hello!</label>
                            <input id="hello" type="text"  className="form-control" onChange={this.helloChanged}/>
                        </div>
                        <div className="form-group">
                            <label for="world">World!</label>
                            <input id="world" type="text"  className="form-control" onChange={this.worldChanged} />
                        </div>
                        <div className="form-group">
                            <label for="select">Select from the following list</label>
                            <Select id="select" class="form-control" options={["s1", "s2", "s3"]}
                                defaultOption={"s3"} onChange={this.selectChanged} />
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this.state.checkValue} onChange={this.checkChanged}
                                />Check me out
                            </label>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Options Group
                            </div>
                            <div className="panel-body">
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="optionsRadios" id="optionsRadios1"
                                        value="option1" checked={this.state.optionValue === 'option1'}
                                        onChange={this.optionChanged}/>
                                        Option one is this and that&mdash;be sure to include why it's great
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="optionsRadios" id="optionsRadios2"
                                        value="option2" checked={this.state.optionValue === 'option2'}
                                        onChange={this.optionChanged}/>
                                        Option two can be something else and selecting it will deselect option one
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button id="save" type="button" className="btn btn-primary" onClick={this.save}>Save</button>
                    </div>
                </div>
            </form>
        );
    }
}

Form.propTyes = {

};

Form.defaultProps = {

};

/*
                            <select id="select" className="form-control" value={this.state.selectValue} onChange={this.selectChanged}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
*/