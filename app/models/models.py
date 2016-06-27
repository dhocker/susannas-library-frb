#
# flask-react - web server for learning to use react front end with Flask back end
# Copyright (C) 2016  Dave Hocker (email: AtHomeX10@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the LICENSE file for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
#

#
# Reference tutorial
#   http://docs.sqlalchemy.org/en/latest/orm/tutorial.html
#   This is a pretty good cover of the most frequently used aspects of SQLAlchemy
#
# Notes
#   *   Sqlite is being used as the database and the code here assumes that
#       to be the case. It does not address any other database.
#

from datetime import datetime
from types import *
from app import app
from sqlalchemy import create_engine, Table, ForeignKey, Column, Integer, Text, Boolean, func, or_

from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

# Here we create a database engine instance. However, a connection is not created until needed.
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'], convert_unicode=True)
# This session object serves as a factory
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

# Classes mapped using the Declarative system are defined in terms of a base class
# which maintains a catalog of classes and tables relative to that base - this is
# known as the declarative base class. Our application will usually have just one
# instance of this base in a commonly imported module.
Base = declarative_base()
# This makes query available as a property of all model classes derived from Base.
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
            elif type(v) == IntType:
                d[column_prop] = v
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
            elif type(v) == IntType:
                d.append = v
            else:
                d.append = str(v)

        # This is a dummy column that can be used by the client
        d.append("Actions")

        return d


class Collaborations(Base):
    __tablename__ = "collaborations"
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey('authors.id'))
    book_id = Column(Integer, ForeignKey('books.id'))
    created_at = Column(Text, default=func.now())
    updated_at = Column(Text, default=func.now())


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
                    secondary='collaborations')


    def __init__(self, last_name, first_name, category, try_author, avoid):
        self.LastName = last_name
        self.FirstName = first_name
        self.category = category
        # This bizarre encoding of booleans comes from the way the existing
        # library database was exported from Heroku and Postgres.
        # SQLite prefers using integers with true == 1 and false == 0
        if try_author:
            self.try_author = 1
        else:
            self.try_author = 0
        if avoid:
            self.Avoid = 1
        else:
            self.Avoid = 0
        self.created_at = datetime.now()
        self.updated_at = self.created_at

    def __repr__(self):
        return "<Author(id=%s, LastName='%s', FirstName='%s', category='%s', Avoid=%s, try=%s)>" \
            % (str(self.id), self.LastName, self.FirstName, self.category, str(self.Avoid), str(self.try_author))


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
    authors = relationship("Author",
                         secondary='collaborations')


    def __init__(self, title, isbn, volume, series_id, author, category, status, cover, notes):
        self.Title = title
        self.ISBN = isbn
        self.Volume = volume
        self.series_id = series_id
        self.authors.append(author)
        self.Category = category
        self.Status = status
        self.CoverType = cover
        self.Notes = notes
        self.created_at = datetime.now()
        self.updated_at = self.created_at

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


class Series(Base, ModelMixin):
    __tablename__ = 'series'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    created_at = Column(Text)
    updated_at = Column(Text)

    # These are the column properties that are exposed (see Mixin class)
    column_props = ["name", "id"]
    # These are the actual table columns corresponding to the column properties
    table_column_names = ["name", "id"]

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