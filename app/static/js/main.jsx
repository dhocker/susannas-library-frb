import React from 'react';
import ReactDOM from 'react-dom';
import * as authorstable from './authors-table';
import Form from './form';
import * as NewAuthor from './new-author-dialog';

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
