/*
    Susanna's Library
    Copyright © 2019  Dave Hocker (email: AtHomeX10@gmail.com)

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
import $ from 'jquery';

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            version: "Unknown"
        };
    }

    componentDidMount() {
        const $this = this;
        const url = "/version";
        $.get(url, function (response /* , status */) {
            const {version} = response.data;
            $this.setState({version: version});
        });
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="row">
                        <h2 className="col-md-8">
                            About
                        </h2>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <p>
                            All about Susanna&apos;s Library
                        </p>
                        <p>
                            Track your collection of books/ebooks using
                            <ul>
                                <li>Authors</li>
                                <li>Books/ebooks written by those authors</li>
                                <li>Series of books</li>
                                <li>Custom categories for authors and books/ebooks</li>
                            </ul>
                        </p>
                        <p>
                            The following technologies are used:
                            <ul>
                                <li>Python 3</li>
                                <li>Flask</li>
                                <li>Javascript</li>
                                <li>React</li>
                                <li>React Router</li>
                                <li>Bootstrap 4</li>
                                <li>Webpack</li>
                            </ul>
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="row">
                        <h3 className="col-md-8">
                            Version {this.state.version}
                        </h3>
                    </div>
                </div>
            </div>
        );
    }
}
