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
		ReceiverGroup.findOne({"name": task.receiverGroup}, function(err, receiverGroup) {
			if(err) callback(err);
			else if(receiverGroup) {
				console.log(receiverGroup.receivers);
				console.log("res");
				callback(null, receiverGroup.receivers.map(function(item) { return item.email}));
			} else {
				callback(null)
				console.log("not res");
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
	 		var message = {
	 			template: template.generate(task.text),
	 			subject: template.subject
	 		};
	 		callback(null, message);
	 	} else {
	 		callback(null);
	 	}
	 })
};

function perform(task, doneCallback) { //require task.templateName task.receiver || receiverGroup task.text
	async.series({
		receivers: function(callback) {
			getReceivers(task, function(err, receivers) {
				callback(err, receivers);
			})
		},
		message: function(callback) {
			generateMessageByTask(task, function(err, message) {
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
			    html: params.message.template
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

