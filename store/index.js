var express = require('express');
var app = express();
var config = require('./config');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('./libs/passport');

app.use(cookieParser());

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(session(
  { secret: 'london is the capital',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

require('./controllers').set(app);

app.listen(config.port, function () {
  console.log('Store app listening on port ' + config.port);
});
