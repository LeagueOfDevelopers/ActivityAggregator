var EmailTemplate = require('./db/mongoose').models.EmailTemplate;
var receiverGroup = require('./db/mongoose').models.ReceiverGroup;
var receiver = require('./db/mongoose').models.EmailReceiver;
var Task = require('./db/mongoose').models.Task;
var Admin = require('./db/mongoose').models.Admin;
var Student = require("./db/mongoose").models.Student;

var taskChecker = require('./MaiManager/mailTaskPerformer');

taskChecker.checkTasks();

var task = new Task({
	type: 'mail',
	receiverGroup: 'testGroup',
	templateName: 'newStudent',
	text: {
		id: '1',
		name: 'Хуян Хуsянович'
	},
	done: false
})

task.save(function(data) {
	console.log(data);
})

function createAdminGroup() {
    var AdminGroup = new receiverGroup({
        name: 'admins',
        receivers: []
    });
    Admin.find(function(err, data) {
        data.forEach(function(admin) {
            var rec = new receiver({id: admin._id, email: admin.email});
            AdminGroup.receivers.push(rec);
            rec.save(function(err, ok) {
                console.log(ok);
            })
        });
        AdminGroup.save(function (err, ok) {
            console.log(ok);
        })
    })

}

function createStudentGroup() {
    var StudentGroup =  new receiverGroup({
        name: 'students',
        receivers: []
    });

    Student.find(function(err, data) {
        data.forEach(function(student  ) {
            var rec = new receiver({id: student._id, email: student.email});
            StudentGroup.receivers.push(rec);
            rec.save(function(err, ok) {
                console.log(err);
            })
        });
        StudentGroup.save(function (err, ok) {
            console.log(err);
        })
    })
};

createAdminGroup();
createStudentGroup();