var packageNotificationsManager = require('./MaiManager/packageNotificationsManager');

packageNotificationsManager.sendNotifications('newStudent', function (err) {
    if(err) console.log(err);
});