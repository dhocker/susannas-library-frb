import React from 'react';
import ReactDOM from 'react-dom';
import Table from './table';
import Form from './form';

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

    console.log("Attempting to create Table");
    ReactDOM.render(<Table class={"table table-striped table-condensed"}
        cols={authorTableColumns}
        url={"/authors"}
        />,
        document.querySelector('#reacttable')
    );
    console.log("Table created");
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
