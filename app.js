require('dotenv').config();

// Basics
var express = require('express');
var app = express();
var enforce = require('express-sslify');

// Sendgrid
// Set the SENDGRID_API_KEY environment variable for this to work
var sendgrid_helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

// JIRA
// Set the JIRA_HOST_URL environment variable for this to work
var JiraClient = require('jira-connector');
var jira = new JiraClient({
    host: process.env.JIRA_HOST_URL,
    basic_auth: {
        base64: process.env.JIRA_AUTH_64
    }
});

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
    jira.issue.createIssue({
        "fields": {
            "project": {"id": process.env.JIRA_PROJECT_ID},
            "issuetype": {"id": process.env.JIRA_ISSUETYPE_ID},
            "summary": form_data.name,
            "customfield_10131": form_data.phone, // 10131 is the phone field
            "customfield_10202": form_data.portfolio, // 10202 is portfolio field
            "customfield_10128": form_data.email, // 10128 is email field
            "customfield_10229": form_data.zip,
            "customfield_10201": "Landing Page" // Referral Field - In the future, we could link ad/referral campaigns to this field!
        }
    }, function (error, issue) {
        console.log("Error: " + JSON.stringify(error));
        console.log("Issue: " + issue);
    });

    res.send();
});

app.listen(app.get('port'), function () {
    console.log('Photographer Landing Page listening on port ' + app.get('port') + '!');
});
