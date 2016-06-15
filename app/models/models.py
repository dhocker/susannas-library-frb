from datetime import datetime
from types import *
from app import app
from sqlalchemy import create_engine, Table, ForeignKey, Column, Integer, Text, Boolean, func, or_

from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'], convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


class ModelMixin():
    '''
    Methods for all models
    '''
    def row2dict(row):
        '''
        Convert a row object to a dict. Used to return JSON to the client.
        :param row:
        :return:
        '''
        d = {}
        for column_prop in row.column_props:
            v = getattr(row, column_prop)
            if type(v) == UnicodeType:
                d[column_prop] = v.encode('utf-8')
            elif type(v) == StringType:
                d[column_prop] = str(v)
            else:
                d[column_prop] = str(v)

        # This is a dummy column that can be used by the client
        d["Actions"] = ""

        return d


    def row2list(row):
        d = []
        for column_prop in row.column_props:
            v = getattr(row, column_prop)
            if type(v) == UnicodeType:
                d.append = str(v)
            elif type(v) == StringType:
                d.append = str(v)
            else:
                d.append = str(v)

        # This is a dummy column that can be used by the client
        d.append("Actions")

        return d


association_table = Table('collaborations', Base.metadata,
    Column('author_id', Integer, ForeignKey('authors.id')),
    Column('book_id', Integer, ForeignKey('books.id'))
)


class Author(Base, ModelMixin):
    __tablename__ = 'authors'
    id = Column(Integer, primary_key=True)
    LastName = Column(Text)
    FirstName = Column(Text)
    Avoid = Column(Integer)
    category = Column(Text)
    try_author = Column('try', Integer)
    created_at = Column(Text)
    updated_at = Column(Text)
    books = relationship("Book",
                    secondary=association_table,
                    backref="authors")


    def __init__(self, last_name, first_name, category, try_author, avoid):
        self.LastName = last_name
        self.FirstName = first_name
        self.category = category
        if try_author:
            self.try_author = 1
        else:
            self.try_author = 0;
        if avoid:
            self.Avoid = 1
        else:
            self.Avoid = 0
        self.created_at = datetime.now()
        self.updated_at = self.created_at


    # Each model must supply these mapping tables for DataTables to work

    # These are the column properties that are exposed (see Mixin class)
    column_props = ["LastName", "FirstName", "category", "try_author", "Avoid", "id"]
    # These are the actual table columns corresponding to the column properties
    table_column_names = ["LastName", "FirstName", "category", "try", "Avoid", "id"]
    default_sorting = "LastName asc, FirstName asc"

    @classmethod
    def global_search(cls, query, search_for):
        '''
        This entity's definition of a global search. Required for DataTables.
        :param query:
        :param search_for:
        :return: Returns a query object with attached filter.
        '''
        like_str = "%{0}%".format(search_for)
        return query.filter(or_(Author.LastName.like(like_str),
                                Author.FirstName.like(like_str)))


class Book(Base, ModelMixin):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    Title = Column(Text)
    ISBN = Column(Text)
    Volume = Column(Integer)
    series_id = Column(Integer, ForeignKey('series.id'))
    Published = Column(Text)
    Category = Column(Text)
    Status = Column(Text)
    CoverType = Column(Text)
    Notes = Column(Text)
    created_at = Column(Text)
    updated_at = Column(Text)
    series = relationship("Series", uselist=False)


    # Each model must supply these mapping tables for DataTables to work

    # These are the column properties that are exposed (see Mixin class)
    column_props = ["Title", "ISBN", "Volume", "series", "Published", "Category", "Status", "CoverType", "Notes", "id"]
    # These are the actual table columns corresponding to the column properties
    table_column_names = ["Title", "ISBN", "Volume", "series", "Published", "Category", "Status", "CoverType", "Notes", "id"]
    default_sorting = "Title asc"

    @classmethod
    def global_search(cls, query, search_for):
        '''
        This entity's definition of a global search. Required for DataTables.
        :param query:
        :param search_for:
        :return: Returns a query object with attached filter.
        '''
        like_str = "%{0}%".format(search_for)
        return query.filter(or_(Book.Title.like(like_str),
                                Book.Notes.like(like_str)))


class Series(Base):
    __tablename__ = 'series'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    created_at = Column(Text)
    updated_at = Column(Text)


if __name__ == "__main__":
    # Case insensitive ordering
    authors = Author.query.order_by(func.lower(Author.LastName), func.lower(Author.FirstName)).all()
    print "All authors"
    for a in authors:
        print a.LastName, a.FirstName, a.id, a.Avoid, a.category, a.try_author, len(a.books)

    print "{0} authors returned".format(len(authors))
    print ""
    #
    # print "Books for author id=633"
    # author = Author.query.filter_by(id=633).first()
    # print author.LastName, author.FirstName
    # for b in author.books:
    #     print b.Title, b.series.name, b.id
    # print "{0} books for author".format(len(author.books))
    # print ""
    #
    # print "Authors for book id=2269"
    # book = Book.query.filter_by(id=2269).first()
    # print book.Title, book.id
    # for a in book.authors:
    #     print a.LastName, a.FirstName
    # print ""
    #
    # multi_author_books =[]
    # single_author_book_count = 0
    # books = Book.query.all()
    #
    # print "Books with multiple authors"
    # for b in books:
    #     if len(b.authors) > 1:
    #         multi_author_books.append(b)
    #         print b.Title, b.id
    #     else:
    #         single_author_book_count += 1
    # if len(multi_author_books) == 0:
    #     print "There are no books with multiple authors"
    # print "There are {0} books with a single author".format(single_author_book_count)