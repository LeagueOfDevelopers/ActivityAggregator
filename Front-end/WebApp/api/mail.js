var SMTPConnection = require('smtp-connection');

var options = {
	port: 25,
	host: 'smtp.yandex.ru'
}

var connection = new SMTPConnection(options);

connection.on('error', function(err) {
	console.log(err);
});

connection.connect(function() {

	connection.login({

		user: 'aggregator@lod-misis.ru',
		pass: '1qaz2wsx#EDC'

	} , function(err) {

		console.log(err || 'connect to smtp');
		console.log(connection.authenticated ? 'smtp authorized' : 'not authorized');

	})
});

module.exports = {
	testSend: testSend
}

function testSend(req, res, next) {

		connection.send({
			from: 'aggregator@lod-misis.ru', 
			to: 'aggregator@lod-misis.ru'
		}, 
		req.params.text, 
		function(err, info) {

			if(err) res.send(err);
			else {

				res.send(info);

			}

		})
}