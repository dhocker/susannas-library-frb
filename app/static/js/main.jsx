import * as authorstable from './authors-table';
import * as pagedbookstable from './paged-books-table';
import * as seriestable from './series-table';
import * as categoriestable from './categories-table';
import * as NewAuthor from './new-author-dialog';
import * as NewBook from './new-book-dialog';
import * as NewSeries from './new-series-dialog';
import * as NewCategory from './new-category-dialog';
import * as aboutdialog from './about-dialog';
import * as callstack from './dialog-call-stack';

/*
    Initialize the home page
*/
export function initHomePage(filter_by, id, name) {
    console.log("Initializing authors page with filter: " +
    filter_by + " " + id + " " + name);
    // Create and load authors table
    authorstable.createAuthorsTable(filter_by, id, name);

    NewAuthor.initNewAuthorDialog(filter_by, id);

    // When New Author button is clicked, clear dialog fields and call dialog
    $("#new-author-btn").click(function () {
        NewAuthor.clearNewAuthorDialog();
        callstack.callDialog("new-author-jsx");
    });

    // Set up search button
    $("#search-button").click(function () {
        const search_arg = $("#search-text").val();
        console.log("Search for authors: " + search_arg);
        authorstable.searchAuthors(search_arg);
    });

    // Make search be the default action for Enter when in the search text box
    searchDefault();
}

/*
    Initialize the paged books page
*/
export function initPagedBooksPage(filter_by, id, name) {
    console.log("Initializing paged books page with filter: " +
        filter_by + " " + id + " " + name);
    // Create and load books table
    pagedbookstable.createPagedBooksTable(filter_by, id, name);

    NewBook.initNewBookDialog(filter_by, id);

    NewAuthor.initNewAuthorDialog();

    NewSeries.initNewSeriesDialog();

    // When New Book button is clicked, clear dialog fields
    $("#new-book-btn").click(function () {
        console.log("New book clicked");
        NewBook.clearNewBookDialog();
        callstack.callDialog("new-book-jsx");
    });

    // Set up search button
    $("#search-button").click(function () {
        const search_arg = $("#search-text").val();
        console.log("Search for books: " + search_arg);
        pagedbookstable.searchBooks(search_arg);
    });

    // Make search be the default action for Enter when in the search text box
    searchDefault();
}

/*
    Initialize the Series page
*/
export function initSeriesPage() {
    // Create and load series table
    seriestable.createSeriesTable();

    NewSeries.initNewSeriesDialog();

    // When New Series button is clicked, clear dialog fields
    $("#new-series-btn").click(function () {
        NewSeries.clearNewSeriesDialog();
        callstack.callDialog("new-series-jsx");
    });

    // Set up search button
    $("#search-button").click(function () {
        const search_arg = $("#search-text").val();
        console.log("Search for series: " + search_arg);
        seriestable.searchSeries(search_arg);
    });

    // Make search be the default action for Enter when in the search text box
    searchDefault();
}

/*
    Initialize the Categories page
*/
export function initCategoriesPage() {
    // Create and load categories table
    categoriestable.createCategoriesTable();

    NewCategory.initNewCategoryDialog();

    // When New Category button is clicked, clear dialog fields
    $("#new-category-btn").click(function () {
        NewCategory.clearNewCategoryDialog();
        callstack.callDialog("new-category-jsx");
    });

    // Set up search button
    $("#search-button").click(function () {
        const search_arg = $("#search-text").val();
        console.log("Search for category: " + search_arg);
        categoriestable.searchSeries(search_arg);
    });

    // Make search be the default action for Enter when in the search text box
    searchDefault();
}

/*
    Initialize layout
*/
export function initLayout() {
    aboutdialog.initAboutDialog();
    console.log("Layout initialized");
}

/*
    Show the abut dialog
*/
export function showAboutDialog() {
    callstack.callDialog("about-jsx");
}

/*
    Search default
*/
function searchDefault() {
    $("#search-text").keypress(function (event) {
        if (event.keyCode === 13) {
            $("#search-button").click();
            event.preventDefault();
        }
    });
}
