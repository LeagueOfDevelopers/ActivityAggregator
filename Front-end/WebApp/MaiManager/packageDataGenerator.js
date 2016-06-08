

function generate(taskArr, callback) {

    var packageData = [];

    taskArr.forEach(function(task) {
        packageData.push(task.text);
        task.done = true;
        task.save();
    });

    callback(packageData);
}


module.exports.generate = generate;