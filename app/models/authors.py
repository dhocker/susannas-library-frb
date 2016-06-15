from models import Author
from sqlalchemy import func
from app.models.models import db_session


def get_all_authors():
    return Author.query.order_by(func.lower(Author.LastName), func.lower(Author.FirstName)).all()


def get_page_of_authors(skip, page_size):
    return Author.query.order_by(func.lower(Author.LastName), func.lower(Author.FirstName)).slice(skip + 1, skip + page_size)


def get_author(id):
    return Author.query.get(id)


def update_author(author):
    db_session.commit()


def insert_author(last_name, first_name, category, try_author, avoid):
    a = Author(last_name, first_name, category, try_author, avoid)
    db_session.add(a)
    db_session.commit()


def delete_author_by_id(id):
    a = Author.query.get(id)
    db_session.delete(a)
    db_session.commit()
