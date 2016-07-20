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

from app.database.connection import get_db, get_cursor
from app.models.categories import get_category
import app.database.utils as utils

def get_books_by_page(page, pagesize, sort_col, sort_dir):
    # Column sorting
    # TODO There are consistency issues. Collab records with no book or no author.
    # We use left outer joins here to get all books regardless of collaborations status.
    stmt = """
        select b.*,
        case when length(a.FirstName) > 0
            then (a.LastName || ", " || a.FirstName)
            else a.LastName
            end as Author,
        a.id as author_id,
        s.name as Series from books as b
        left outer join collaborations as c on c.book_id=b.id
        left outer join authors as a on a.id=c.author_id
        left outer join series as s on s.id=b.series_id
        order by {0}
        limit :limit offset :offset
        """.format(get_sort_clause(sort_col, sort_dir))
    parameters = {"limit": pagesize, "offset": int(page * pagesize)}

    csr = get_cursor()
    rst = csr.execute(stmt, parameters)
    rows = utils.rows2list(rst)

    return {"rows": rows, "count": get_filtered_books_count(None, None, None, None)}

def search_for_books_by_page(page, pagesize, author_id, series_id, category_id, search_arg, sort_col, sort_dir):
    # Build where clause based on filter inputs
    # We used named parameters to prevent Sql injection vulnerabilities
    parameters = {"limit": pagesize, "offset": int(page * pagesize)}
    wh = ""
    if author_id:
        wh = "where c.author_id=:author_id"
        parameters["author_id"] = str(int(author_id))
    elif series_id:
        wh = "where b.series_id=:series_id"
        parameters["series_id"] = str(int(series_id))
    elif category_id:
        category = get_category(category_id)
        wh = "where b.category=:category_name"
        parameters["category_name"] = category.name
    if search_arg:
        # Sql injection prevention on search arg
        s = "%" + search_arg + "%"
        parameters["like"] = s
        wh = 'where b.Title like :like'

    stmt = """
        select b.*,
        case when length(a.FirstName) > 0
            then (a.LastName || ", " || a.FirstName)
            else a.LastName
            end as Author,
        a.id as author_id,
        s.name as Series, s.id as series_id from books as b
        left outer join collaborations as c on c.book_id=b.id
        left outer join authors as a on a.id=c.author_id
        left join series as s on s.id=b.series_id
        {1}
        order by {0}
        limit :limit offset :offset
        """.format(get_sort_clause(sort_col, sort_dir), wh)

    csr = get_cursor()
    rst = csr.execute(stmt, parameters)
    rows = utils.rows2list(rst)

    return {"rows": rows, "count": get_filtered_books_count(author_id, series_id, category_id, search_arg)}

def get_filtered_books_count(author_id, series_id, category_id, search_arg):
    # Build where clause based on filter inputs
    # We used named parameters to prevent Sql injection vulnerabilities
    wh = ""
    parameters = {}
    if author_id:
        wh = "where c.author_id=:author_id"
        parameters["author_id"] = str(int(author_id))
    elif series_id:
        wh = "where b.series_id=:series_id"
        parameters["series_id"] = str(int(series_id))
    elif category_id:
        category = get_category(category_id)
        wh = "where b.category=:category_name"
        parameters["category_name"] = category.name
    if search_arg:
        # Sql injection prevention on search arg
        s = "%" + search_arg + "%"
        parameters["like"] = s.encode('utf-8')
        wh = 'where b.Title like :like'

    stmt = """
        select count(*) from books as b
        left outer join collaborations as c on c.book_id=b.id
        left outer join authors as a on a.id=c.author_id
        left join series as s on s.id=b.series_id
        {0}
        """.format(wh)

    csr = get_cursor()
    count = csr.execute(stmt, parameters).fetchone()[0]
    return count


def get_sort_clause(sort_col, sort_dir):
    # Depends on tables aliased as follows:
    # b = books
    # a = authors
    # s = series
    column_sort_list = {
        "Title": "lower(b.Title) {0}",
        "ISBN": "b.ISBN {0}",
        "Volume": "b.Volume {0}",
        "Series": "lower(s.name) {0}",
        "Published": "b.Published {0}",
        "Category": "lower(b.Category) {0}",
        "Status": "lower(b.Status) {0}",
        "CoverType": "lower(b.CoverType) {0}",
        "Notes": "lower(b.Notes) {0}",
        "id": "b.id {0}",
        "Author": "lower(a.LastName) {0}, lower(a.FirstName) {0}"
    }

    # Sql injection prevention
    sd = "asc"
    if sort_dir.lower() == "desc":
        sd = "desc"

    return column_sort_list[sort_col].format(sd)
