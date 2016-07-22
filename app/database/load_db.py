#
# Susanna's New Library
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

import os
from sqlite3 import dbapi2 as sqlite3
import sys
import argparse

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
                print line
                raise ex
            line_count += 1
            if line_count % 100 == 0:
                print "\r", line_count,
    db.commit()
    db.close()
    print "\r", line_count
    print ""


if __name__ == "__main__":
    arg_parser = argparse.ArgumentParser(description='Create and load a fresh Sqlite3 library database')
    # Just a single schema file
    arg_parser.add_argument('--schema', dest='schema_file', default='tables_for_sqlite3.sql',
                            help='Name of schema script file to use to create the database')
    # We allow multiple seed files
    arg_parser.add_argument('--seed', dest='seed_file', default=['export_db.sql'], action='append',
                            help='Name of a seed script file to use to load the database')
    # The output database file
    arg_parser.add_argument('db_file', nargs='?', default='susannas_library.sqlite3',
                            help='Name of the output Sqlite3 database file')
    # Parse the command line
    args = arg_parser.parse_args()

    print ""
    print "Using the following files:"
    print "\tdatabase:\t", args.db_file
    print "\tschema:\t\t", args.schema_file
    print "\tseed(s):\t\t", args.seed_file
    print ""

    dbname = args.db_file
    schema_script_name = args.schema_file
    # exit(0)

    # Delete existing database
    try:
        os.remove(dbname)
        print "Deleted existing database"
    except:
        pass

    # Recreate the database and schema
    init_db(schema_script_name)
    print "New database file created"

    # Seed database
    print ''
    # Execute each seed script file
    for f in args.seed_file:
        seed_db(f)

    print 'Loading complete'
    print ''
