# Susanna's Library Using Flask, React, Bootstrap and Webpack

## Overview
This is the newest iteration of Susanna's Library developed using 
Flask, React, Booststrap and Webpack.

## Set Up
Create a venv using the requirements.txt file.

    mkvirtualenv -r requirements.txt susannas-library-frb

Install Webpack and various dependencies called out in package.json. Note that on a system 
like a Raspberry Pi this can take a long time.

    npm install

## Development Build
Run a one time build based on webpack.config.js

    npm run build
    
Or, run build watcher

    npm run build-w

## Production/Deployment Build
Run a one time build based on production.webpack.config.js

    npm run build-p
    
This build uglifies and compresses the compiled output.
## Debug and Test
Use PyCharm.

## Run Test Server from Root Directory

    python runserver.py

## Using NGINX and uWSGI
NGINX with uWSGI makes a good "production" environment.

###NGINX
The stock version of nginx that installs through apt-get is usually adequate. This app does not
present a heavy load.

NGINX likes to run under a non-root user like www-data. Keep this in mind as you build your configuration.
Using the same user with uWSGI greatly simplifies things. For example, make sure the directory where you put
your unix socket file is owned and accessible by www-data (or whatever user you choose).

###uWSGI
The stock version of uWSGI that is currently installed under Raspbian Wheezy and Jessie is usually out of date. 
It is recommended that you install the most current version of uWSGI (as identified in the requirements.txt file)
and modify the init.d script to use the version you install in a virtualenv. The uwsgi-emperor script file
described above does exactly that.


## Run NGINX with uWSGI Non-Emperor Mode

### susannas_nginx_site
nginx configuration file for the app. This file should go in /etc/nginx/sites-available.
To activate the site, put a symbolic link to the file in /etc/nginx/sites-enabled.
Edit this file based on your nginx server installation. If Susanna's Library is the only web app running
under nginx, you might not need to make any changes. This configuration uses port 5005 to route
traffic to the app.

### susannas_uwsgi_app.ini 
uwsgi configuration file for the app. For non-Emperor mode,
this file should go in /etc/uwsgi/apps-available.
To activate the app for non-Emperor mode, put a symbolic link in /etc/uwsgi/apps-enabled.
Edit this file based on how you set up your virtualenv. If you rename the file, make sure it ends
with .ini otherwise uwsgi will not recognize it.

## Run NGINX with uWSGI Emperor Mode
###susannas_nginx_site
nginx configuration file for the app. This file should go in /etc/nginx/sites-available.
To activate the site, put a symbolic link to the file in /etc/nginx/sites-enabled.
Edit this file based on your nginx server installation. If Susanna's Library is the only web app running
under nginx, you might not need to make any changes. This configuration uses port 5005 to route
traffic to the app.

### uwsgi-emperor
If you want to use emperor mode, put this file in /etc/init.d and register it as
a start up daemon using update-rc.d.

### susannas_uwsgi_app.ini
uwsgi configuration file for the app.
For Emperor mode, put this file in /etc/uwsgi/vassals.
Edit this file based on how you set up your virtualenv. If you rename the file, make sure it ends
with .ini otherwise uwsgi will not recognize it.

## Additional References
For examples on how to do multiple entry points (for each page),
see the following.

- [https://webpack.github.io/docs/multiple-entry-points.html]
(https://webpack.github.io/docs/multiple-entry-points.html)

- [https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points]
(https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points)

- [https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks]
(https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks)
