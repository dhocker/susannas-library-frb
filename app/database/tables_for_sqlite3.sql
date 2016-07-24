DROP TABLE if exists collaborations;
DROP TABLE if exists books;
DROP TABLE if exists series;
DROP TABLE if exists authors;
DROP TABLE if exists categories;

CREATE TABLE series (
    id integer primary key autoincrement,
    name text NULL,
    created_at text NOT NULL default (datetime('now','localtime')),
    updated_at text NOT NULL default (datetime('now','localtime'))
);

CREATE TABLE authors (
    id integer primary key autoincrement,
    LastName text NULL,
    FirstName text NULL,
    Avoid integer NULL,
    category text NULL,
    category_id integer NOT NULL default 0,
    try integer NULL,
    created_at text NOT NULL default (datetime('now','localtime')),
    updated_at text NOT NULL default (datetime('now','localtime')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
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
    category_id integer NOT NULL default 0,
    created_at text NOT NULL default (datetime('now','localtime')),
    updated_at text NOT NULL default (datetime('now','localtime')),
    FOREIGN KEY (series_id) REFERENCES series(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE collaborations (
    id integer primary key autoincrement,
    author_id integer NULL,
    book_id integer NULL,
    created_at text NOT NULL default (datetime('now','localtime')),
    updated_at text NOT NULL default (datetime('now','localtime')),
    FOREIGN KEY (author_id) REFERENCES authors(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE categories (
    id integer primary key autoincrement,
    name text NOT NULL,
    created_at text NOT NULL default (datetime('now','localtime')),
    updated_at text NOT NULL default (datetime('now','localtime')),
    CONSTRAINT unique_name UNIQUE (name)
);
