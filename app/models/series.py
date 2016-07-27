#
# Susanna's New Library - web app for managing Susan's vast library
# Copyright (c) 2016  Dave Hocker (email: AtHomeX10@gmail.com)
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
from models import Series
from sqlalchemy import func, or_
from app.models.models import db_session


def get_all_series(page, pagesize, sort_col, sort_dir):
    q = append_order_by_clause(Series.query, sort_col, sort_dir)
    if pagesize > 0:
        series = q.limit(pagesize).offset(page * pagesize).all()
    else:
        series = q.offset(page * pagesize).all()
    count = q.count()
    return {"rows": Series.rows2dictlist(series), "count": count}

def append_order_by_clause(query, sort_col, sort_dir):
    column_list = {
        "name": Series.name,
        "id": Series.id
    }

    if sort_col in column_list:
        if sort_dir == "desc":
            if sort_col == "id":
                q = query.order_by(column_list[sort_col].desc())
            else:
                q = query.order_by(func.lower(column_list[sort_col]).desc())
        else:
            if sort_col == "id":
                q = query.order_by(column_list[sort_col].asc())
            else:
                q = query.order_by(func.lower(column_list[sort_col]).asc())
    else:
        q = query.order_by(func.lower(column_list["name"]).asc())
    return q

def get_series(series_id):
    return Series.query.get(series_id)

def search_for_series(page, pagesize, search_arg, sort_col, sort_dir):
    q = append_order_by_clause(Series.query, sort_col, sort_dir)
    if search_arg:
        like = '%' + search_arg + '%'
        q = q.filter(Series.name.like(like))
    count = q.count()
    series =  q.limit(pagesize).offset(page * pagesize)
    return {"rows": Series.rows2dictlist(series), "count": count}

def insert_series(name):
    s = Series(name)
    db_session.add(s)
    db_session.commit()

def series_exists(name):
    """
    Case insensitive check to see if a series exists
    :param name:
    :return: Returns the count of existing series. If the series
    does not exist, returns 0.
    """
    c = Series.query.filter(func.lower(Series.name) == func.lower(name)).count()
    return c

def update_series(series):
    db_session.commit()

def delete_series_by_id(id):
    """
    Delete a series and any related books.
    Note that this is a cascading delete.
    :param id:
    :return:
    """
    s = Series.query.get(id)
    db_session.delete(s)
    db_session.commit()
