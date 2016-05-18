var config = require('../config.js').smtp;
var nodemailer = require('nodemailer');
var EmailTemplate = require('../db/mongoose').models.EmailTemplate;
var ReceiverGroup = require('../db/mongoose').models.ReceiverGroup;
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

function getReceivers(task, callback) {
	if(task.receiverGroup) {
		ReceiverGroup.findOne({"name": task.receiverGroup}, function(err, receivers) {
			if(err) callback(err);
			else if(receivers) {
				console.log(receivers.map(function(item) { return item.email}));
				callback(null, receivers.map(function(item) { return item.email}));
			} else {
				callback(null)
			}
		})
	} else {
		 callback(null, task.receiver);
	}
};

function generateMessageByTask(task, callback) {
	 EmailTemplate.findOne({"name": task.templateName}, function(err, template) {
	 	if(err) callback(err);
	 	else if(template) {
	 		console.log(template.generate(task.text));
	 		callback(null, template.generate(task.text));
	 	} else {
	 		callback(null);
	 	}
	 })
};

function perform(task, doneCallback) {
	async.series({
		receivers: function(callback) {
			getReceivers(task, function(err, receivers) {
				callback(err, receivers);
				console.log(err);
				console.log(receivers);
			})
		},
		message: function(callback) {
			generateMessageByTask(task, function(err, message) {
				console.log(err);
				console.log(message);
				callback(err, message);
			})
		}
	},
	//callback
	 function(err, params) {
		if(err) doneCallback(err);
		else if(params.receivers && params.message) {
			console.log('params');
			console.log(params);
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
			doneCallback('task params error')
		}
	});
};

