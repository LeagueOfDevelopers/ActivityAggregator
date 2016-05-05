var config = require('../config.js').smtp;
var nodemailer = require('nodemailer');

module.exports = {
	testSend: testSend
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
 
function testSend(params, callback) {

	var mailOptions = {
	    from: config.sender, 
	    to: params.to, 
	    subject: params.subject,  
	    text: params.text, 
	    html: params.html 
	};
	 

	transporter.sendMail(mailOptions, function(err, info){
	    if(err) callback(err)
	    else callback(info);
	});

};