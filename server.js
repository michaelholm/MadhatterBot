var madhatterbot = require('./madhatterbot');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3100;

/**
 *  body parser middleware
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 *  error handler
 */ 
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});

/**
 *  routes
 */
app.all('*', function (req, res, next) {
  var types = ['css', 'js', 'html'];
  var fragment = req.body.text.split(" ")[0];
  if (types.indexOf(fragment) > -1) {
    var component = req.body.text.split(" ")[1];
    req.body.fragment = fragment;
    req.body.component = component;
  } else {
    req.body.component = fragment;
  }
  next(); // pass control to the next handler
});

app.post('/madhatter', madhatterbot);


/**

curl --request POST 'http://localhost:3100/madhatter' --data 'text='

*/