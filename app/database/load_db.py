

import os
from sqlite3 import dbapi2 as sqlite3

dbname = 'susannas_library.sqlite3'

def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect(dbname)
    rv.row_factory = sqlite3.Row
    return rv


def init_db(filename):
    """Initializes the database."""
    db = connect_db()
    with open(filename , mode='r') as f:
        print 'Creating database...'
        db.cursor().executescript(f.read())
    db.commit()
    db.close()


def seed_db(filename):
    """Seeds the database."""
    db = connect_db()
    line_count = 0
    with open(filename, mode='r') as f:
        print 'Executing seed script {0}...'.format(filename)
        for line in f:
            db.cursor().execute(line)
            line_count += 1
            if line_count % 100 == 0:
                print "\r", line_count,
    db.commit()
    db.close()
    print ""


def seed_categories():
    """
    Seedsthe categories table. This table did not exist in
    the Rails version of Susanna's Library, so there is
    no data for it in the Heroku export.
    :return:
    """
    db = connect_db()
    line_count = 0
    with open('categories.sql', mode='r') as f:
        print 'Executing seed script {0}...'.format('categories.sql')
        for line in f:
            db.cursor().execute(line)
            line_count += 1
            if line_count % 100 == 0:
                print "\r", line_count,
    db.commit()
    db.close()
    print ""


if __name__ == "__main__":

    # Recreate the database and schema
    init_db("tables_for_sqlite3.sql")
    print "Database created"

    # Seed database
    print ''
    seed_db("export.sql")
    seed_categories();
    print 'Loading complete'
    print ''
