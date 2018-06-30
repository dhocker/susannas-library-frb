/*
    React component template
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
import PropTypes from 'prop-types';

/*
    This is a template for a basic React component.
*/

export default class BasicComponent extends React.Component {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {};
    }

    componentDidMount() {
        /*
        this.serverRequest = $.get(this.props.url, function(response, status){
            console.log("Data rows received: " + String(response.data.length));
            this.setState({rows: response.data});
        }.bind(this));
        */
    }

    render() {
        return (
            <div className="">
            </div>
        );
    }
}

BasicComponent.propTypes = {
    /* Example of property types
    title: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    cols: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    */
};

BasicComponent.defaultProps = {
};
