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
import { Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import { Button } from 'react-bootstrap';

function Navigation() {
    return (
        <div className="container">
            <Navbar className="navbar navbar-expand-lg navbar-light bg-light" role="navigation">
                <Nav className="navbar-nav mr-auto">
                    <IndexLinkContainer to="/authors-page" className="">
                        <Button className="nav-btn">Authors</Button>
                    </IndexLinkContainer>
                    <LinkContainer to="/new-author-form" className="">
                        <Button className="nav-btn">New Author</Button>
                    </LinkContainer>
                    <LinkContainer to="/books-page" exact className="">
                        <Button className="nav-btn">Books</Button>
                    </LinkContainer>
                    <LinkContainer to="/new-book-form" className="">
                        <Button className="nav-btn">New Book</Button>
                    </LinkContainer>
                    <LinkContainer to="/series-page" className="">
                        <Button className="nav-btn">Series</Button>
                    </LinkContainer>
                    <LinkContainer to="/new-series-form" className="">
                        <Button className="nav-btn">New Series</Button>
                    </LinkContainer>
                    <LinkContainer to="/categories-page" className="">
                        <Button className="nav-btn">Categories</Button>
                    </LinkContainer>
                    <LinkContainer to="/new-category-form" className="">
                        <Button className="nav-btn">New Category</Button>
                    </LinkContainer>
                    <LinkContainer to="/about-page" className="">
                        <Button className="nav-btn">About</Button>
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
