require('dotenv').config();

// Basics
var express = require('express');
var app = express();

// Sendgrid
// Set the SENDGRID_API_KEY environment variable for this to work
var sendgrid_helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

// JIRA
// Set the JIRA_HOST_URL environment variable for this to work
var JiraClient = require('jira-connector');
var jira = new JiraClient( { 
    host: process.env.JIRA_HOST_URL,
    basic_auth: {
        base64: process.env.JIRA_AUTH_64
    }
});

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.post("/apply", function(req, res) {
    console.log(req.body);
    var form_data = req.body;
    var from_email = new sendgrid_helper.Email(process.env.FROM_EMAIL);
    var to_email = new sendgrid_helper.Email(process.env.TO_EMAIL);
    var subject = 'Photo Application!';
    var body = "<h1>New photography application</h1><br/>Name: " + form_data.name + 
        "<br/>Email: " + form_data.email +
        "<br/>Phone: " + form_data.phone +
        "<br/>Zip Code: " + form_data.zip +
        "<br/>Website: " + form_data.portfolio;
    var content = new sendgrid_helper.Content('text/html', body);
    var mail = new sendgrid_helper.Mail(from_email, subject, to_email, content);
    var sg_request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });
    sg.API(sg_request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
    
    jira.issue.createIssue({
        "fields": {
            "project": {"id":process.env.JIRA_PROJECT_ID},
            "issuetype": {"id":process.env.JIRA_ISSUETYPE_ID},
            "summary": form_data.name,
            "description": JSON.stringify(form_data)
        }
    }, function(error, issue) {
        console.log("Error: " + error);
        console.log("Issue: " + issue);
    });

    res.send();
})

app.listen(app.get('port'), function () {
    console.log('Photographer Landing Page listening on port ' + app.get('port') + '!');
});
