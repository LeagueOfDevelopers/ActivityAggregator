var config = require('../config.js').smtp;
var nodemailer = require('nodemailer');
var emailTemplate = require('../db/schemas/emailTemplate');
var receiverGroup = require('../db/schemas/receiverGroup');
var async = require('async');


module.exports = {
	send: send,
	perform: perform
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
	    to: params.receivers, 
	    subject: params.subject,  
	    text: params.text, 
	    html: params.html || null 
	};
	 

	transporter.sendMail(mailOptions, function(err, info){
	    callback(err, info);
	});

};

function getReceivers(task) {
	if(task.receiverGroup) {
		receiverGroup.find({"name": task.receiverGroup}, function(err, receivers) {
			if(err) return err;
			else if(receivers) {
				return receivers;
			} else {
				return null
			}
		})
	} else {
		return task.receiver;
	}
};

function generateMessageByTemplate(task) {
	 emailTemplate.findOne({"name": task.templateName}, function(err, template) {
	 	if(err) return err;
	 	else if(template) {
	 		return template.generate(task.text);
	 	} else {
	 		return null
	 	}
	 })
};

function perform(task, doneCallback) {
	async.series({
		receivers: function(callback) {
			var receivers = getReceivers(task);
			if(receivers) {
				callback(null, receivers)
			}
		},
		message: function(callback) {
			callback(generateMessageByTemplate(task.text));
		}
	},
	//callback
	 function(err, params) {
		if(err) console.log(err);
		else if(params.receivers && params.message) {
			send({
				receivers: params.receivers,
			    subject: params.message.subject,
			    text: params.message.text
			}, function(err, info) {
				if(err) console.log(err);
				else  {					//all ok
					console.log(info);
					doneCallback();
				}
			})
		} else {
			console.log("task params error");
		}
	});
};

