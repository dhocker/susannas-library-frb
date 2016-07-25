#
# Susanna's New Library - Database Conversion 01
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
# This conversion adds category_id to the authors and books table
# as a foreign key to the categories table. The conversion code
# takes the category field and looks it up in the categories table.
# If the category is found the record's category_id field is
# updated with the id. If the category is not found, the record
# is left unchanged (default category_id value is 0).
#

from sqlite3 import dbapi2 as sqlite3
import sys
import types


dbname = 'susannas_library.sqlite3'


def connect_db(database_name):
    """Connects to the specific database."""
    cnn = sqlite3.connect(database_name)
    cnn.row_factory = sqlite3.Row
    return cnn


def get_category_id(csr, category):
    stmt = "SELECT id from categories where name='{0}'".format(category)
    rst = csr.execute(stmt).fetchone()
    if rst:
        return rst["id"]
    return 0

def convert_authors(cnn):
    csr = cnn.cursor()
    update_stmt = "UPDATE authors SET category_id={0} where id={1}"

    stmt = "SELECT id, category, category_id from authors"
    rst = csr.execute(stmt).fetchall()

    n = 0
    no_cat = 0
    for r in rst:
        category = r["category"]
        if category == '':
            category = ' '
        category_id = get_category_id(csr, category)
        if category_id == 0:
            print "No category for author category '{0}'".format(category)
            no_cat += 1
        else:
            print "Author id {0} Category '{1}' id {2}".format(r["id"], category, category_id)
            csr.execute(update_stmt.format(category_id, r["id"]))
        n += 1

    print "{0} total author records".format(n)
    print "{0} author records without known category".format(no_cat)

    cnn.commit()
    csr.close()

def convert_books(cnn):
    csr = cnn.cursor()
    update_stmt = "UPDATE books SET category_id={0} where id={1}"

    stmt = "SELECT id, category, category_id from books"
    rst = csr.execute(stmt).fetchall()

    n = 0
    no_cat = 0
    for r in rst:
        category = r["category"]
        if category == '':
            category = ' '
        category_id = get_category_id(csr, category)
        if category_id == 0:
            print "No category for book category '{0}'".format(category)
            no_cat += 1
        else:
            print "Book id {0} Category '{1}' id {2}".format(r["id"], category, category_id)
            csr.execute(update_stmt.format(category_id, r["id"]))
        n += 1

    print "{0} total book records".format(n)
    print "{0} book records without known category".format(no_cat)

    cnn.commit()
    csr.close()


def convert_database(db_name):
    cnn = connect_db(db_name)
    convert_authors(cnn)
    convert_books(cnn)
    cnn.close()


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == '--help':
        print ""
        print "Convert library database for category ID change"
        print ""
        print "\tconvert_db.py"
        print ""
        print "\tDatabase is converted in place"
        print ""
        exit(0)

    convert_database(dbname)