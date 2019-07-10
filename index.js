"use strict";

var Service;
var https = require('https');
var startTimestamp;

var options = {
  host: 'api.pushover.net',
  port: 443,
  path: '/1/messages.json',
  method: 'POST',
  headers: {
      'content-type': 'application/json'
  }
};

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  homebridge.registerAccessory("homebridge-powerloss-pushover-notifier", "PowerlossPushoverNotifier", PowerlossPushoverNotifier);
}

function PowerlossPushoverNotifier(log, config) {
  var logger = log;
  var now = new Date();
  var startTimestamp = now.toString();
  var startUnix = now.getTime();

  function requesting(options, callback) {
    var req = https.request(options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        logger('Request approved from Pushover server');
        // TO DO: verify response code
      });
    });

    req.on('error', function (e) {
      if (e.message && (e.message.startsWith("getaddrinfo ENOTFOUND") || e.message.startsWith("getaddrinfo EAI_AGAIN"))) {
        // Retry in 30 seconds if no internet connection
        logger('No internet connection. Retrying connection in 30 seconds');
        setTimeout(function () { return requesting(options, callback) }, 30000);
      } else {
        logger('problem with request: ' + e.message);
      }
    });

    // Always passing current timestamp as value1
    var requestObj = {
      token: config['token'],
      user: config['user'],
      title: 'Powerloss Occured',
      message: `Powerloss occured @ ${startTimestamp}`,
      timestamp: startUnix
    }

    var request = JSON.stringify(requestObj);
    
    logger("Sending request: " + request);

    req.write(request);
    req.end();
  };
  requesting(options, function (err, resp) {
    // Continue
  });

  this._service = new Service.AccessoryInformation();
}

PowerlossPushoverNotifier.prototype.getServices = function () {
  return [this._service];
}
