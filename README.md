Acclamation
===========

Acclamation is a web application designed to make retrospectives easier.  Retros can be incredibly useful; but with large teams, retros can become tedios and inefficient.  Instead of writing sticky notes and cramming around a white board, Acclamation allows teams to substitute technology for tedium.

Requirements
------------

* Node.js >= v0.10
* NPM
* Redis

Installation
------------

    npm install
    bower install

Starting the Server
-------------------

Compile static assets:

    # minified version
    grunt assets:install

    # or non-minified version
    grunt assets:install_dev

Run the server:

    npm start

A Procfile is provided for development:

    foreman start -f Procfile.development

This runs the application inside of `supervisor`, watching for changes to any non-vendored ".js" files.  It also runs `grunt assets:watch` to recompile JavaScript and CSS assets when they change.

You can also pre-populate Redis with data using:

    grunt db:do_over

Since data in Redis is not persisted to disk, you will need to run this command while the application is running.

Now, point your server to `http://localhost:8000` and retrospect!
