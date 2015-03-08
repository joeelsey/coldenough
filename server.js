'use strict';

var express = require('express');
var request = require('superagent');
var app = express();

app.get('/zip/:zip', function(req, res) {
  var key = process.env.WUNDER_API;
  var zip = req.params.zip;
  var weatherUrl = 'http://api.wunderground.com/api/' + key +
    '/conditions/q/' + zip + '.json';

  if (isNaN(req.params.zip) === true) return res.status(500).send({msg: 'not a number'});
  if (zip.length > 6) return res.status(500).send({msg: 'zip code not found'});

  request
    .get(weatherUrl)
    .end(function(err, weatherdata) {
      if (err) return res.status(500).send(err);
      if (!weatherdata) res.status(500).send('data not found');

      var parsedData = JSON.parse(weatherdata.text);
      var temp = parsedData.current_observation.temp_f;
      var hot = ' and its too warm to store beer outside.';
      var cold = ' and its cold enough to store beer outside.';
      if (temp < 50) {
        res.json({
          msg: 'temp in your city is ' + temp + 'F°' + cold
        });
      } else if (temp > 50) {
        res.json({
          msg: 'temp in your city is ' + temp + 'F°' + hot
        });
      } else {
        res.json({
          msg: 'Not a valid zip.  Please retry.'
        });
      }
    });
});

app.use(express.static(__dirname + '/public'));
app.get('/public', function(req, res) {
  res.redirect('/index.html');
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: ' + app.get('port'));
});
