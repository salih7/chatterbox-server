/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const querystring = require('querystring');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var responseBody = { results: [{}] };

var objectId = 0;

module.exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  var method = request.method;
  var url = request.url;

  responseBody.headers = headers;
  responseBody.method = method;
  responseBody.url = url;

  // at this point, `body` has the entire request body stored in it as a string
  if (!request.url.startsWith('/classes/messages' || '/classes/room')) {
    statusCode = 404;
  } else {
    if (request.method === 'OPTIONS') {
      response.writeHead(statusCode, headers);
      response.end();
    } else if (request.method === 'GET') {
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({ results: responseBody.results }));
    } else if (request.method === 'POST') {
      var body = '';
      var data = {};
      request.on('data', function(data) {
        body += data;
      });

      request.on('end', function() {
        data = querystring.parse(body);
        data.objectId = ++objectId;
        responseBody.results.push(data);
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify({objectId: 1}));
      });

      statusCode = 201;
    }
  }

};

// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

