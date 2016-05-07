var config = require('../config.js').smtp;
var nodemailer = require('nodemailer');

module.exports = {
	send: send
};
 
var transporter = nodemailer.createTransport(
	{
		port: config.port,
		host: config.host,
		auth: {
	        user: config.login,
	        pass: config.password
    	}
});
 
function send(params, callback) {

	var mailOptions = {
	    from: config.sender, 
	    to: params.receiver, 
	    subject: params.subject,  
	    text: params.text, 
	    html: params.html || null 
	};
	 

	transporter.sendMail(mailOptions, function(err, info){
	    callback(err, info);
	});

};