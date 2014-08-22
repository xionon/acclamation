Acclamation
===========

Acclamation is a web application designed to make retrospectives easier.  Retros can be incredibly useful; but with large teams, retros can become tedios and inefficient.  Instead of writing sticky notes and cramming around a white board, Acclamation allows teams to substitute technology for tedium.

Requirements
------------

* Node.js >= v0.11
* NPM

Installation
------------

    npm install

You can also pre-populate Redis with data using:

    grunt db:do_over

Usage
-----

Run the server:

    grunt assets:install
    npm start

A Procfile is provided for development:

    foreman start

This runs the application inside of `supervisor`, watching for changes to any non-vendored ".js" files.  It also runs `grunt assets:watch` to recompile JavaScript and CSS assets when they change.

Point your server to `http://localhost:8000` and retrospect!
