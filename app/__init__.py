# coding=utf-8
#
# Susanna's Library - for tracking authors and books
# Copyright © 2016, 2018  Dave Hocker (email: AtHomeX10@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# See the LICENSE file for more details.
#
#######################################################################

import os
import Logging
import logging

from flask import Flask

import configuration


app = Flask(__name__)


# Load default config and override config from an environment variable
# This is really the Flask configuration
app.config.update(dict(
    DATABASE='susannas_library.sqlite3',
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',
    SQLALCHEMY_DATABASE_URI='',  # Use Sqlite file db
    CSRF_ENABLED=True,
    USER_ENABLE_EMAIL=False                   # Disable emails for now

))

# This is the app-specific configuration
cfg = configuration.Configuration.load_configuration(app.root_path)

# Load randomly generated secret key from file
# Reference: http://flask.pocoo.org/snippets/104/
# Run make_secret_key to create a new key and save it in secret_key
key_file = configuration.Configuration.SecretKey()
app.config['SECRET_KEY'] = open(key_file, 'r').read()
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///{0}".format(configuration.Configuration.get_database_file_path('susannas_library.sqlite3'))

# Start logging
Logging.EnableServerLogging()

# All views must be imported after the app is defined
from app.views import views
from app.views import books
from app.views import series
from app.views import paged_books
from app.views import categories
#from app.views import login_views

logger = logging.getLogger("app")

from Version import GetVersion
logger.info("################################################################################")
logger.info("Starting Flask-React version %s", GetVersion())
logger.info("Using configuration file %s", configuration.Configuration.get_configuration_file_path())
