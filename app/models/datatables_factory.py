#
# Based on this code: https://gist.github.com/illerucis/4586359
# Courtesy of Rob illerucis
#
# Refer to https://datatables.net/manual/server-side
#

from collections import namedtuple
from flask import request
import json
from sqlalchemy.sql.expression import text

'''
        $(document).ready(function(){
            $('#data-table').dataTable({
                {# "processing": true, #}
                "serverSide": true,
                "ajax": {
                    "url": "{{ url_for('authors_data') }}",
                    "type": "GET"
                },
                columns: [
                    { data: 'LastName' },
                    { data: 'FirstName' },
                    { data: 'category' },
                    { data: 'try_author' },
                    { data: 'Avoid' }
                ]
            });
        });
'''


class DataTablesFactory(object):
    #
    # jQuery DataTables helper. See http://datatables.net/
    #
 
    def __init__( self, request, entity, id=None):

        self.entity = entity
        self.query = entity.query
        self.id = id

        # values specified by the datatable for filtering, sorting, paging
        self.request_args = request.args

        # results from the db
        self.result_data = None
         
        # total in the table after filtering
        self.total_filtered_records = 0
 
        # total in the table unfiltered
        self.total_records = 0

        # apply request values
        self.paging()
 
        self.run_queries()


    @classmethod
    def build_dt_result(cls, query_results, recordsTotal, recordsFiltered):
        '''

        :param query_results:
        :param recordsTotal:
        :param recordsFiltered:
        :return:
        '''

        output = {}
        output['recordsTotal'] = str(recordsTotal)
        output['recordsFiltered'] = str(recordsFiltered)

        #output['aaData'] = self.result_data

        # If you return a dict (JS object), then the DataTables definition
        # on the page MUST define the column mapping. If you return a list/array
        # then the order of data in each row array must match the column ordering
        # of the table.
        r = []
        for row in query_results:
            r.append(row.row2dict())
        output["aaData"] = r

        return output


    def output_result(self):
        '''
        Translate the query result to a JSON compatible format that
        jQuery DataTables will accept. Refer to https://datatables.net/manual/server-side
        :return:
        '''
                
        return DataTablesFactory.build_dt_result(self.result_data, self.total_records, self.total_filtered_records)


    def run_queries(self):

        # the term you entered into the datatable search
        search_clause = self.searching()
         
        # the document field you chose to sort
        sorting = self.sorting()
 
        # get result from db to display on the current page
        working_query = self.query

        # Apply id filtering
        if self.id:
            working_query = working_query.filter_by(id=self.id)

        # If there is a search value, apply it
        if search_clause:
            working_query = self.entity.global_search(working_query, search_clause)

        # If there is an explicit sort/order, apply it
        if sorting:
            working_query = working_query\
                .order_by(sorting)
        else:
            # TODO Default sorting?
            working_query = working_query\
                .order_by(self.entity.default_sorting)\

        # This is the final query with paging applied
        self.result_data = working_query\
            .slice(self.page_start, self.page_start + self.page_length)\
            .all()

        # length of filtered set
        # If there is no filter then, the filtered set and the total set are the same.
        self.total_filtered_records = len(working_query.all())

        # length of all results you wish to display in the datatable, unfiltered
        self.total_records = len(self.query.all())


    def searching(self):
        clause = None
        search_str = self.request_args["search[value]"]
        if search_str != "":
            clause = "{0}='{1}'".format(self.entity.table_column_names[0], search_str)
        #return clause
            return search_str

    def sorting(self):
        '''
        References:
        https://datatables.net/manual/server-side
        http://www.datatables.net/examples/basic_init/multi_col_sort.html
        :return: Order by clause
        '''

        #
        # Determine number of columns to sort on based on inspection of args.
        # Iterate order[n] until order[n] does not exist.
        # Build composite order clause: "col1 dir1, col2 dir2, ..."
        # Solve problem with column (property) name being different from the actual column
        # name in the table (e.g. try_author vs. try).
        # Current implementation only supports a single sort column.
        #
        i = 0
        order = ""
        while True:
            order_col = "order[{0}][column]".format(i)
            if order_col in self.request_args and self.request_args[order_col] != "":
                order_col_index = int(self.request_args[order_col])
                column_name = self.request_args["columns[{0}][data]".format(order_col_index)]
                # Map column name to actual table column name
                column_name = self.entity.table_column_names[order_col_index]
                if len(order) > 0:
                    order += ","
                # Note this produces case insensitive ordering
                order += column_name + " COLLATE NOCASE " + self.request_args["order[{0}][dir]".format(i)]
            else:
                # We stop when the next order column is not in the request args
                break
            i += 1

        # print "Sort clause: ", order
        return order

 
    def paging(self):
        '''
        Extract page start and length from the request
        :return:
        '''

        # paging defaults
        self.page_start = 0
        self.page_length = 10

        if (self.request_args['start'] != "" ) and (self.request_args['length'] != -1 ):
            self.page_start = int(self.request_args['start'])
            self.page_length = int(self.request_args['length'])
