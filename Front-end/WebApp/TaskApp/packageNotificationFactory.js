var Task = require('../db/mongoose').models.Task;
var mailer = require('./mailer');
var Student = require('./db/mongoose').models.Student;


function generatePackageNotifications(templateName) {

    var receiverGroups = {
        receivers: {},
        groups: {}
    };

    Task.find({"type":  'package', 'templateName' : templateName}, function(err, data) {
            if(err) console.log(err);
            else if(data) {
                data.forEach(function(task) {
                    if(task.receiverGroup) {

                        if (!receiverGroups.group[task.receiverGroup]) receiverGroups.group[task.receiverGroup] = [];

                                receiverGroups.group[task.receiverGroup].push(task.text);

                    } else if(task.receiver) {

                        if (!receiverGroups.receivers[task.receiver]) receiverGroups.receivers[task.receiver] = [];

                                 receiverGroups.receivers[task.receiver].push(task.text);

                    }
                });



            } else {
                console.log("no new package tasks");
            }

        receiverGroups.receivers.forEach(sendToReceiver);
        receiverGroups.groups.forEach(sendToGroup);
        
    });

};

function sendToReceiver(dataForReceiver, receiver) {
    mailer.perform({receiver: receiver, text: {data: dataForReceiver, count: dataForReceiver.length}, templateName: templateName }, function(err, data) {
        if(err) console.log(err);
        else console.log(data);
    })
};

function sendToGroup(dataForReceiver, receiverGroup) {
    mailer.perform({receiverGroup: receiverGroup, text: {data: dataForReceiver, count: dataForReceiver.length}, templateName: templateName }, function(err, data) {
        if(err) console.log(err);
        else console.log(data);
    })
};


module.exports.sendPackageNotifications = generatePackageNotifications;