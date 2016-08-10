/*
    Action Anchor component
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

/*
    Use this component to create anchors for item actions in app paged tables.
    It avoids the well known binding problem where new instances of functions get
    created on every render.
*/

import React from 'react';

export default class ActionAnchor extends React.Component {
    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
    }

    /*
        When the anchor is clicked delegate the click to its handler
    */
    onItemClick() {
        this.props.onItemClick(this.props.item);
    }

    render() {
        return (
            <a href={this.props.htmlHref} onClick={this.onItemClick}>{this.props.anchorText}</a>
        );
    }
}

ActionAnchor.propTypes = {
    anchorText: React.PropTypes.string.isRequired,
    htmlHref: React.PropTypes.string.isRequired,
    onItemClick: React.PropTypes.func.isRequired,
    item: React.PropTypes.object.isRequired,
};
