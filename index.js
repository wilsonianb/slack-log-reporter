'use strict';

var Tail = require('always-tail');
var Slack = require('slack-node');
 
const webhookUri = process.env['WEBHOOK_URI']
const logFile = process.env['LOG_FILE']

var slack = new Slack();
slack.setWebhook(webhookUri);

function messageSlack (message) {
  slack.webhook({
    text: message
  }, function(err, response) {
    if (err)
      console.log(err)
  });
}

var tail = new Tail(logFile)

tail.on('line', function(data) {
  if (data.indexOf('Transaction has failed one or more invariants') !== -1) {
    console.log(data);
    messageSlack('<!channel> `' + data + '`')
  } else if (data.indexOf(':FTL') !== -1) {
    console.log(data)
    messageSlack('`' + data + '`')
  }
});

tail.on('error', function(data) {
  console.log("error:", data);
  messageSlack(data)
});
 
tail.watch();
