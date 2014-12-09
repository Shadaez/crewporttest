var http = require('http'),
	extip = require('externalip'),
	request = require('request'),
	jxm = require('jxm'),
    ports = [3000, 3001, 3002, 80, 443, 13000, 14000, 14008], 
    servers = []; 

ports.forEach(function(port) { 
	var s = http.createServer(function(req, res){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write("Success.");
		res.end();
	}).listen(port);
	s.on('error', function(){
		console.log('Failed to listen on port ' + port + '.');
	});
	servers.push(s); 
});

console.log('Now listening on ports: ' + ports + '.');
extip(function(err, ip){
	ip = ip.replace(/(\r\n|\n|\r)/gm,"");
	console.log('Testing ports...');
	ports.forEach(function(port){
		request.get('http://' + ip + ':' + port, function(err, res){
			if(err){
				console.log('Port ' + port + ' is not reachable. Error: ' + err.code + '.');
			} else {
				console.log('Port ' + port + ' is' + (res.statusCode == '200'? '' : ' not') + ' forwarded.');
			}
		})
	});
});