require('dotenv').config();

// Basics
var express = require('express');
var app = express();
var enforce = require('express-sslify');
var request = require('superagent');

// Sendgrid
// Set the SENDGRID_API_KEY environment variable for this to work
var sendgrid_helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

if(process.env.REDIRECT_SSL === 'true'){
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.post("/apply", function (req, res) {
    console.log(req.body);
    var form_data = req.body;
    var from_email = new sendgrid_helper.Email(process.env.FROM_EMAIL);
    var to_email = new sendgrid_helper.Email(process.env.TO_EMAIL);
    var subject = 'Photo Application!';
    var body = "<h1>New photography application</h1><br/>Name: " + form_data.firstName + " " + form_data.lastName +
        "<br/>Email: " + form_data.email +
        "<br/>Phone: " + form_data.phone +
        "<br/>Address: " + form_data.city + ", " + form_data.state + " " + form_data.zip +
        "<br/>Website: " + form_data.portfolio;
    var content = new sendgrid_helper.Content('text/html', body);
    var mail = new sendgrid_helper.Mail(from_email, subject, to_email, content);
    var sg_request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });
    sg.API(sg_request, function (error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

    // validate that the portfolio is a URL
    if (!form_data.portfolio.match(/^[a-zA-Z]+:\/\//))
    {
        form_data.portfolio = 'http://' + form_data.portfolio;
    }

    request.post('https://harvest.greenhouse.io/v1/candidates')
        .auth(process.env.GREENHOUSE_API_KEY)
        .set('Content-Type', 'application/json')
        .set({'On-Behalf-Of': process.env.GREENHOUSE_ADMIN_USER_ID})
        .send({
            first_name: form_data.firstName,
            last_name: form_data.lastName,
            email_addresses: [{
                value: form_data.email,
                type: 'work'
            }],
            phone_numbers: [{
                value: form_data.phone,
                type: 'mobile'
            }],
            website_addresses: [{
                value: form_data.portfolio,
                type: 'portfolio'
            }],
            addresses:[{
                value: form_data.city + ", " + form_data.state + " " + form_data.zip,
                type: 'work'
            }],
            applications: [{
                job_id: process.env.GREENHOUSE_JOB_ID,
                source_id: process.env.GREENHOUSE_PHOTOGRAPHY_LANDING_PAGE_SOURCE_ID
            }]
        })
        .end(function(error, response){
            if(error){
                res.status(error.status).json({error: error.response});
            } else {
                res.status(201).send("candidate created with id: " + response.body.id);
            }
        });

});

app.listen(app.get('port'), function () {
    console.log('Photographer Landing Page listening on port ' + app.get('port') + '!');
});
