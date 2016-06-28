import React from 'react';
import ReactDOM from 'react-dom';
import * as authorstable from './authors-table';
import * as bookstable from './books-table';
import Form from './form';
import * as NewAuthor from './new-author-dialog';
import * as NewBook from './new-book-dialog';

/*
    Initialize the home page
*/
export function initHomePage() {
    // Create and load authors table
    authorstable.createAuthorsTable();

    NewAuthor.initNewAuthorDialog();

    // When New Author button is clicked, clear dialog fields
    $("#new-author-btn").click(function() {
        NewAuthor.clearNewAuthorDialog();
    });

    // Set up search button
    $("#search-button").click(function() {
        var search_arg = $("#search-text").val();
        console.log("Search for authors: " + search_arg);
        authorstable.searchAuthors(search_arg);
    });
};

/*
    Initialize the books page
*/
export function initBooksPage(author_id, author_name) {
    console.log("Initializing books page for author id: " + author_id);
    // Create and load books table
    bookstable.createBooksTable(author_id, author_name);

    NewBook.initNewBookDialog(author_id);

    // When New Book button is clicked, clear dialog fields
    $("#new-book-btn").click(function() {
        console.log("New book clicked");
        NewBook.clearNewBookDialog();
    });

    // Set up search button
    $("#search-button").click(function() {
        var search_arg = $("#search-text").val();
        console.log("Search for books: " + search_arg);
        //authorstable.searchAuthors(search_arg);
    });
};

/*
    Initialize the form page
*/
export function initFormPage() {
    console.log("Attempting to create Form class");
    var formform = <Form />;
    ReactDOM.render(
        <Form />,
        document.querySelector('#reactform')
    );
    console.log("Form class created");
};
