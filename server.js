// Simple Node.js server that I use to test my projects.
// To run, you need to have node and installed

// Then simply run "node server" from the command line in this directory
// at that point you can view the demo by visiting http://127.0.0.1:9000/index.html

var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(request, response) {
	var filePath = '.' + request.url;
	if(filePath == './') {
		filePath = './index.html';
	}
		
	var extname = path.extname(filePath);
	var contentType = 'application/octet-stream';
	switch(extname) {
		case '.html':
			contentType = 'text/html';
			break;
		case '.js':
			contentType = 'text/javascript';
			break;
	}
	fs.readFile(filePath, function(error, content) {
		if(error) {
			response.writeHead(404);
			response.end();
		} else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});
	
}).listen(9000);

console.log('Server running at http://127.0.0.1:9000/');
