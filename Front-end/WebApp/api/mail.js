var nodemailer = require('nodemailer');

module.exports = {
	testSend: testSend
}
 
// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport(
	{
		port: 25,
		host: 'smtp.yandex.ru',
		auth: {
	        user: 'aggregator@lod-misis.ru',
	        pass: '1qaz2wsx#EDC'
    	}
	});
 


function testSend(req, res, next) {

		var mailOptions = {
		    from: '"Fred Foo 👥" <aggregator@lod-misis.ru>', // sender address 
		    to: 'skyteether@gmail.com', // list of receivers 
		    subject: 'Hello ✔', // Subject line 
		    text: 'Hello world 🐴', // plaintext body 
		    html: '<b>Hello world 🐴</b>' // html body 
		};
 

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        res.send(error);
    }
    res.send(info);
});

}