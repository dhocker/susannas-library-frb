

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
        print 'Creating database using script: ' + filename
        try:
            db.cursor().executescript(f.read())
        except Exception as ex:
            print ex
            raise ex
    db.commit()
    db.close()


def seed_db(filename):
    """Seeds the database."""
    db = connect_db()
    line_count = 0
    with open(filename, mode='r') as f:
        print 'Executing seed script {0}...'.format(filename)
        for line in f:
            try:
                db.cursor().execute(line)
            except Exception as ex:
                print ex
                raise ex
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
    seed_db("categories.sql")
    print 'Loading complete'
    print ''
