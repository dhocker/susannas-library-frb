DROP TABLE if exists collaborations;
DROP TABLE if exists books;
DROP TABLE if exists series;
DROP TABLE if exists authors;

CREATE TABLE series (
    id integer primary key autoincrement,
    name text NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL
);

CREATE TABLE authors (
    id integer primary key autoincrement,
    LastName text NULL,
    FirstName text NULL,
    Avoid integer NULL,
    category text NULL,
    try integer NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL
);

CREATE TABLE books (
    id integer primary key autoincrement,
    Title text NULL,
    ISBN text NULL,
    Volume integer NULL,
    series_id integer NULL,
    Published text NULL,
    Category text NULL,
    Status text NULL,
    CoverType text NULL,
    Notes text NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series(id)
);

CREATE TABLE collaborations (
    id integer primary key autoincrement,
    author_id integer NULL,
    book_id integer NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);


