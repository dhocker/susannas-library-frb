CREATE TABLE authors
(
  id serial NOT NULL,
  "LastName" character varying(255),
  "FirstName" character varying(255),
  "Avoid" boolean,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  category character varying(255),
  try boolean,
  CONSTRAINT authors_pkey PRIMARY KEY (id )
)

CREATE TABLE books
(
  id serial NOT NULL,
  "Title" character varying(255),
  "ISBN" character varying(255),
  "Volume" integer,
  series_id integer,
  "Published" character varying(255),
  "Category" character varying(255),
  "Status" character varying(255),
  "CoverType" character varying(255),
  "Notes" character varying(255),
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT books_pkey PRIMARY KEY (id )
)

CREATE TABLE collaborations
(
  id serial NOT NULL,
  author_id integer,
  book_id integer,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT collaborations_pkey PRIMARY KEY (id )
)

CREATE TABLE series
(
  id serial NOT NULL,
  name character varying(255),
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  CONSTRAINT series_pkey PRIMARY KEY (id )
)

