import React from 'react';
import ReactDOM from 'react-dom';
import * as authorstable from './authors-table';
import Form from './form';
import NewAuthorDialog from './new-author-dialog';

/*
    Initialize the home page
*/
export function initHomePage() {
    // Defines the columns in the authors table
    var authorTableColumns = [
        { colname: 'LastName', label: 'Last Name' },
        { colname: 'FirstName', label: 'First Name' },
        { colname: 'category', label: 'Category' },
        { colname: 'try_author', label: 'Try' },
        { colname: 'Avoid', label: 'Avoid' },
        { colname: 'id', label: 'ID' }
    ];

    authorstable.createAuthorsTable();

    console.log("Attempting to create ModalDialog");
    ReactDOM.render(<NewAuthorDialog id="new-author-jsx" />, document.querySelector('#new-author'));
    console.log("ModalDialog created");
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
