Store Admin
================

## How to use?

### Setup
Run `npm install`, followed by `bower install` to grab the dependencies.

### Running the app
Run `grunt server` to start the app in development mode with livereload

### Testing
Run `grunt test` to start the karma test runner.

## Directory structure
    +---server.js           -> Server
    |
    +---app                 -> Client
    |   +---scripts
    |   |   +---controllers
    |   |   +---directives
    |   |   \---services
    |   |
    |   +---styles
    |   \---views
    |       \---partials
    |           \---products
    +---lib                 -> Server
    |   +---config
    |   +---controllers
    |   +---db
    |   \---models
    |           
    +---test                -> Unit tests
