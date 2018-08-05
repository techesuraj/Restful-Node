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

    //Send the response
    res.end('Hello World\n');

  //Log the request path
    console.log('Request received with this payload', buffer);
  })

  
});
//Start the server, and have it listen to port 3000
server.listen(3000, function(){
  console.log('Server is listening to port 3000')
})