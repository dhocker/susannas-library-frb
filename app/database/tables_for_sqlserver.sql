DROP TABLE collaborations;
DROP TABLE books;
DROP TABLE series;
DROP TABLE authors;

CREATE TABLE [dbo].[series] (
    [id]   INT           IDENTITY (1, 1) NOT NULL,
    [name] VARCHAR (255) NULL,
    CONSTRAINT [series_pk] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[authors] (
    [id]        INT           IDENTITY (1, 1) NOT NULL,
    [LastName]  VARCHAR (255) NULL,
    [FirstName] VARCHAR (255) NULL,
    [Avoid]     BIT           NULL,
    [category]  VARCHAR (255) NULL,
    [try]       BIT           NULL,
    CONSTRAINT [authors_pk] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[books] (
    [id]        INT           IDENTITY (1, 1) NOT NULL,
    [Title]     VARCHAR (255) NULL,
    [ISBN]      VARCHAR (255) NULL,
    [Volume]    INT           NULL,
    [seriesid]  INT           NULL,
    [Published] VARCHAR (255) NULL,
    [Category]  VARCHAR (255) NULL,
    [Status]    VARCHAR (255) NULL,
    [CoverType] VARCHAR (255) NULL,
    [Notes]     VARCHAR (255) NULL,
    CONSTRAINT [books_pk] PRIMARY KEY CLUSTERED ([id] ASC)
);

CREATE TABLE [dbo].[collaborations] (
    [id]       INT IDENTITY (1, 1) NOT NULL,
    [authorid] INT NULL,
    [bookid]   INT NULL,
    CONSTRAINT [collaborations_pk] PRIMARY KEY CLUSTERED ([id] ASC),
    FOREIGN KEY ([authorid]) REFERENCES [dbo].[authors] ([id]),
    FOREIGN KEY ([bookid]) REFERENCES [dbo].[books] ([id])
);


