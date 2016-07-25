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

from sqlite3 import dbapi2 as sqlite3
import sys
import types


dbname = 'susannas_library.sqlite3'


def connect_db(database_name):
    """Connects to the specific database."""
    cnn = sqlite3.connect(database_name)
    cnn.row_factory = sqlite3.Row
    return cnn


def escape_quote(v):
    return v.replace("'", "''")


def export_authors(csr, file_handle):
    stmt = """SELECT a.id,
        a.LastName,
        a.FirstName,
        a.Avoid,
        a.category_id,
        a.try,
        a.created_at,
        a.updated_at
        FROM authors as a;
    """
    rst = csr.execute(stmt)
    export_row_set(rst, "authors", file_handle)


def export_books(csr, file_handle):
    stmt = """SELECT b.id,
        b.Title,
        b.ISBN,
        b.Volume,
        b.series_id,
        b.Published,
        b.Status,
        b.CoverType,
        b.Notes,
        b.category_id,
        b.created_at,
        b.updated_at
        FROM books as b;
    """
    rst = csr.execute(stmt)
    export_row_set(rst, "books", file_handle)


def export_table(csr, table_name, file_handle):
    """
    Export ALL columns of a table to a file
    :param csr:
    :param table_name:
    :param file_handle:
    :return:
    """
    stmt = "SELECT * FROM {0}".format(table_name)
    rst = csr.execute(stmt)
    export_row_set(rst, table_name, file_handle)


def export_row_set(rst, table_name, file_handle):
    """
    Export a list of rows to a given file
    :param rst:
    :param file_handle:
    :return:
    """
    csf = None
    for row in rst:
        # Build field list
        if not csf:
            #print row.keys()
            for col in row.keys():
                if csf:
                    csf = csf + ',"' + col + '"'
                else:
                    csf = '"' + col + '"'
            print csf

        # Build values list
        csv = None
        for col in row.keys():
            # TODO Escape single quotes
            v = row[col]
            t = type(v)
            if t == types.StringType:
                v = "'" + escape_quote(v) + "'"
            elif t == types.IntType:
                v = str(v)
            elif t == types.UnicodeType:
                v = "'" + escape_quote(v.encode("utf-8")) + "'"
            elif t == types.NoneType:
                v = "''"
            else:
                v = str(v)

            if csv:
                csv = csv + "," + v
            else:
                csv = v
        #print csv
        stmt = "INSERT INTO {0} ({1}) VALUES ({2});\n".format(table_name, csf, csv)
        file_handle.write(stmt)


def export_database(db_name, export_file):
    cnn = connect_db(db_name)
    csr = cnn.cursor()
    fh = open(export_file, mode='w')
    #export_table(csr, "authors", fh)
    export_authors(csr, fh)
    #export_table(csr, "books", fh)
    export_books(csr, fh)
    export_table(csr, "series", fh)
    export_table(csr, "collaborations", fh)
    export_table(csr, "categories", fh)


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == '--help':
        print ""
        print "Export the library database {0} as a SQL script".format(dbname)
        print ""
        print "\texport_db.py [export_name]"
        print ""
        print "\texport_name defaults to export_db.sql"
        print "\tAn existing export file will be overwritten"
        print ""
        exit(0)

    # Resolve export file name
    if len(sys.argv) > 1:
        export_file = sys.argv[1]
    else:
        export_file = "export_db.sql"

    export_database(dbname, export_file)