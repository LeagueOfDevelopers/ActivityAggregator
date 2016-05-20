var EmailTemplate = require('./db/mongoose').models.EmailTemplate;
var receiverGroup = require('./db/mongoose').models.ReceiverGroup;
var receiver = require('./db/mongoose').models.EmailReceiver;
var Task = require('./db/mongoose').models.Task;

var taskChecker = require('./TaskApp/taskChecker');

taskChecker.checkTasks();

// var task = new Task({
// 	type: 'mail',
// 	receiverGroup: 'testGroup',
// 	templateName: 'newStudent',
// 	text: {
// 		id: '1',
// 		name: 'Хуян Хуsянович'
// 	},
// 	done: false
// })

// task.save(function(data) {
// 	console.log(data);
// })
