var packageNotificationsManager = require('./MaiManager/packageNotificationsManager');
var shedule = require('./config.js').shedule;

var schedule = require('node-schedule');



var j = schedule.scheduleJob(shedule, function(){

    doJob();

});

function doJob() {

    packageNotificationsManager.sendNotifications('newStudent', function (err) {
        if(err) console.log(err);
    });

    packageNotificationsManager.sendNotifications('newAchivment', function (err) {
        if(err) console.log(err);
    });
}

