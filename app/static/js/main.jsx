import React from 'react';
import ReactDOM from 'react-dom';
import * as authorstable from './authors-table';
import * as bookstable from './books-table';
import * as seriestable from './series-table';
import Form from './form';
import * as NewAuthor from './new-author-dialog';
import * as NewBook from './new-book-dialog';
import * as NewSeries from './new-series-dialog';

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
export function initBooksPage(filter_by, id, name) {
    console.log("Initializing books page with filter: " + filter_by + " " + id + " " +name);
    // Create and load books table
    bookstable.createBooksTable(filter_by, id, name);

    NewBook.initNewBookDialog(filter_by, id);

    // When New Book button is clicked, clear dialog fields
    $("#new-book-btn").click(function() {
        console.log("New book clicked");
        NewBook.clearNewBookDialog();
    });

    // Set up search button
    $("#search-button").click(function() {
        var search_arg = $("#search-text").val();
        console.log("Search for books: " + search_arg);
        bookstable.searchBooks(search_arg);
    });
};

/*
    Initialize the Series page
*/
export function initSeriesPage() {
    // Create and load series table
    seriestable.createSeriesTable();

    NewSeries.initNewSeriesDialog();

    // When New Series button is clicked, clear dialog fields
    $("#new-series-btn").click(function() {
        NewSeries.clearNewSeriesDialog();
    });

    // Set up search button
    $("#search-button").click(function() {
        var search_arg = $("#search-text").val();
        console.log("Search for series: " + search_arg);
        seriestable.searchSeries(search_arg);
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
