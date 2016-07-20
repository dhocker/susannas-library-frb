

import os
from sqlite3 import dbapi2 as sqlite3
import sys

dbname = 'susannas_library.sqlite3'

def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect(dbname)
    rv.row_factory = sqlite3.Row
    return rv


def init_db(schema_script_name):
    """Initializes the database."""
    db = connect_db()
    with open(schema_script_name , mode='r') as f:
        print 'Creating new database {0} using schema script {1}'.format(dbname, schema_script_name)
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
    print "\r", line_count
    print ""


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == '--help':
        print ""
        print "Create and load a fresh library database"
        print ""
        print "\tload_db.py [db_name]"
        print ""
        print "\tdb_name defaults to tables_for_sqlite3.sql"
        print "\tAny existing database will be deleted and recreated"
        print ""
        exit(0)

    # Resolve schema init script
    if len(sys.argv) > 1:
        schema_script_name = sys.argv[1]
    else:
        schema_script_name = "tables_for_sqlite3.sql"

    # Delete existing database
    try:
        os.remove(dbname)
        print "Deleted existing database"
    except:
        pass

    # Recreate the database and schema
    init_db(schema_script_name)
    print "Database created"

    # Seed database
    print ''
    seed_db("export.sql")
    seed_db("categories.sql")
    print 'Loading complete'
    print ''
