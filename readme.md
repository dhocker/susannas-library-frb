# Flask, React and Webpack

## Overview
This is a playground sandbox for the combination of Flask, React and Webpack.
The following pages illustrate various aspects of React.
- home

## Set Up
Create a venv with flask and sqlalchemy.

    mkvirtualenv -r requirements.txt flask-react

Install Webpack and various dependencies called out in package.json.

    npm install

## Build
Run a one time build

    npm run build
    
Run build watcher

    npm run build-w
    
## Debug and Test
Use PyCharm.

## Additional References
For examples on how to do multiple entry points (for each page),
see the following.

- [https://webpack.github.io/docs/multiple-entry-points.html]
(https://webpack.github.io/docs/multiple-entry-points.html)

- [https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points]
(https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points)

- [https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks]
(https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks)
