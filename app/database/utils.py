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

from types import *


def rows2list(rows):
    """
    Convert a list of Sqlite3 row objects into a list of dicts.
    :param rows:
    :return:
    """
    rlist = []
    for r in rows:
        rlist.append(row2dict(r))
    return rlist


def row2dict(row):
    '''
    Convert an Sqlite3 row object to a dict. Primarily used to return JSON to the client.
    :param row:
    :return:
    '''
    d = {}
    for column_name in row.keys():
        v = row[column_name]
        if type(v) == UnicodeType:
            d[column_name] = v.encode('utf-8')
        elif type(v) == IntType:
            d[column_name] = v
        else:
            d[column_name] = str(v)

    return d
