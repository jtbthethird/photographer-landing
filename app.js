require('dotenv').config();

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.post("/apply", function(req, res) {
    console.log(req.body);
    res.send();
})

app.listen(app.get('port'), function () {
    console.log('Photographer Landing Page listening on port ' + app.get('port') + '!');
});
