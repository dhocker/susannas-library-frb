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

export default class About extends React.Component {
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
                            All about Susanna&apos;s New Library
                        </p>
                        <p>
                            The following are used:
                        </p>
                        <ul>
                            <li>Python 3</li>
                            <li>Flask</li>
                            <li>React</li>
                            <li>React Router</li>
                            <li>Bootstrap 4</li>
                            <li>Webpack</li>
                            <li>Javascript</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
