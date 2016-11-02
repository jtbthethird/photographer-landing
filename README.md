photographer-landing
======================
A site for interested photographers to apply to join the Main Street Hub photographer network.

Requirements
------------
Node.js

Installation
------------
Download this repo and run `npm install`

Make sure you have the following environment variables set on the machine:

    FROM_EMAIL=example@example.com
    TO_EMAIL=destination@example.com
    SENDGRID_API_KEY=sendgridapikeygoeshere
    JIRA_AUTH_64=base64|username:password
    JIRA_HOST_URL=some-site.atlassian.net
    JIRA_ISSUETYPE_ID=12345
    JIRA_PROJECT_ID=55555

Run
---
To run the MSH landing page, start the npm server using `npm start`
