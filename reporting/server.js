var express = require('express');
var path = require('path');

module.exports = function(){
    var app = express();

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/',function(req, res){
        res.render('index');
    });

    return app;
};
