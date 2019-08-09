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
import { Nav, Navbar, NavItem, NavbarBrand } from "react-bootstrap";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";

function Navigation() {
    return (
        <div className="container">
            <Navbar className="navbar navbar-expand-lg navbar-light bg-light" role="navigation">
                <Nav className="navbar-nav mr-auto">
                    <IndexLinkContainer to="/authors-page" className="">
                        <NavItem className="">Authors</NavItem>
                    </IndexLinkContainer>
                    <LinkContainer to="/new-author-page" className="">
                        <NavItem className="">New Author</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/books-page" className="">
                        <NavItem className="">Books</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/new-book-page" className="">
                        <NavItem className="">New Book</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/series-page" className="">
                        <NavItem className="">Series</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/new-series-page" className="">
                        <NavItem className="">New Series</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/categories-page" className="">
                        <NavItem className="">Categories</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/new-category-page" className="">
                        <NavItem className="">New Category</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/about-page" className="">
                        <NavItem className="">About</NavItem>
                    </LinkContainer>
                </Nav>
                <NavbarBrand className="navbar-brand">
                    <img src="static/book_pile.png" alt="BookPile" className=""
                        style={{height:"auto", width:"auto", "maxWidth":"50px", "maxHeight":"50px"}}
                    />
                    <span className="navbar-text-logo h2">
                        Susanna&apos;s Library
                    </span>
                </NavbarBrand>
            </Navbar>
        </div>
    );
}

export default Navigation;
