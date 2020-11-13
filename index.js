console.log ('hello Blue');

var http = require ('http');
var url = require ('url');
var stringDecoder = require ('string_decoder').StringDecoder;

var config = require ('./config');

var server = http.createServer (function (req, res) {
  var pasrsedUrl = url.parse (req.url, true);
  var path = pasrsedUrl.pathname;
  var trimedPath = path.replace (/^\/+|\/+$/g, '');

  var queryString = pasrsedUrl.query;
  var method = req.method.toLowerCase ();

  var headers = req.headers;

  var decoder = new stringDecoder ('utf-8');
  var buffer = '';
  req.on ('data', function (data) {
    buffer += decoder.write (data);
  });
  req.on ('end', function () {
    buffer += decoder.end ();
  });

  var chooseRouteHandler = typeof router[trimedPath] != 'undefined'
    ? router[trimedPath]
    : handlers.notfound;

  var data = {
    trimedPath: trimedPath,
    queryString: queryString,
    method: method,
    headers: headers,
    payload: buffer,
  };

  chooseRouteHandler (data, function (statusCode, payload) {
    statusCode = typeof statusCode == 'number' ? statusCode : 200;
    payload = typeof payload == 'object' ? payload : {};

    var payloadString = JSON.stringify (payload);

    res.setHeader ('Content-Type', 'application/json');
    res.writeHead (statusCode);
    res.end (payloadString);

    console.log (`Returning the response ${statusCode} ${payloadString}`);
  });
});

server.listen (config.port, function () {
  console.log (
    `SERVER UP AND RUNNING ON ${config.port} in ${config.envName} MODE RIGHT NOW`
  );
});

var handlers = {};

handlers.greeting = function (data, callback) {
  callback (202, {message: 'Hello World and Hello to You PIRPLE Instructor'});
};

handlers.notfound = function (data, callback) {
  callback (404);
};

var router = {
  greeting: handlers.greeting,
};
