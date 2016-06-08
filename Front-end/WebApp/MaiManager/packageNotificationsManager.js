var taskCheckers = require('./taskCheckers');
var taskPerformer = require('./mailTaskPerformer');

var policies = {
    newStudent: newStudent,
    newAchivment: newAchivment
};

function sendNotifications(policyName, callback) {
    if (!policies[policyName]) callback('not found ' + policyName  +' policy in mail policies');
    else {
        policies[policyName]();
        callback(null);
    }
}

function newStudent() {
    taskCheckers.checkPackageTasks('newStudent', 'admins', null, taskPerformer.performPackageTask);
}

function newAchivment() {
    taskCheckers.checkPackageTasks('newAchivment', 'admins', null, taskPerformer.performPackageTask);
}

module.exports.sendNotifications = sendNotifications;