/*
* Primary file for the API
*
*/

//Dependencies

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer(function(req,res) {
  // Get the url and parse it 
  let parsedUrl = url.parse(req.url,true);

  //Get the path from the url
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g,'')

  //Get the query string as an object
  let queryStringObject = parsedUrl.query;

  //Get the HTTP method
  let method = req.method.toLowerCase();

  //Get the headers as an Object
  let headers = req.headers;

  //Get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();
    //Choose the handler this request should go to. If one is not found, use notFound handler
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    //Construct a data object to send to handler
    let data  = {
      'trimmedPath': trimmedPath,
      'queryStringObject':queryStringObject,
      'method':method,
      'headers':headers,
      'payload':buffer
    };
   //Route the request to the handler specified in the router
    chosenHandler(data,function(statusCode,payload){
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode: 200;
      //Use the payload called back by the handler, or default to  an empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      //return the Response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('Returning this response', statusCode, payloadString);
    })
    

  //Log the request path

  })

  
});
//Start the server, and have it listen to port 3000
server.listen(3000, function(){
  console.log('Server is listening to port 3000')
})

// Define handlers
let handlers = {};

//Sample handler
handlers.sample = function(data,callback){
  // Callback a http status code and a payload Object
  callback(406, {'name':'Sample handler'})

};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404)
};
// Define a request router

let router = {
  'sample': handlers.sample
};