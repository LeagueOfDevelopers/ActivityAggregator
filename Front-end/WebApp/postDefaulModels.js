var EmailTemplate = require('./db/mongoose').models.EmailTemplate;
var receiverGroup = require('./db/mongoose').models.ReceiverGroup;
var receiver = require('./db/mongoose').models.EmailReceiver;
var Task = require('./db/mongoose').models.Task;
var Admin = require('./db/mongoose').models.Admin;
var Student = require("./db/mongoose").models.Student;
var config = require('./config.js');


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
//
// task.save(function(data) {
// 	console.log(data);
// })

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


function regitstryTemplates() {
     var newStudent = new EmailTemplate({
         name: 'newStudent',
         subject: 'Новые заявки на регистрацию',
         text: 'Подана новыя заявка',
         htmlTemplate: config.emailTemplates + 'newStudent.jade'
     });
    newStudent.save(function (err, data) {
        console.log(err || data);
    });

    var ach = new EmailTemplate({
        name: 'newAchivment',
        subject: 'Новые заявки на добавление достижения',
        text: 'Подана новыя заявка',
        htmlTemplate: config.emailTemplates + 'newAchivment.jade'
    });
    ach.save(function (err, data) {
        console.log(err || data);
    });

    var achivmentConfirmed = new EmailTemplate({
        name: 'achivmentConfirmed',
        subject: 'Ваше достижение подтверждено',
        text: 'Подана новыя заявка',
        htmlTemplate: config.emailTemplates + 'achievementConfirmed.jade'
    });

    achivmentConfirmed.save(function (err, data) {
        console.log(err || data);
    });

    var achivmentRej = new EmailTemplate({
        name: 'achivmentRejected',
        subject: 'Ваше достижение не подтверждено',
        text: 'Подана новыя заявка',
        htmlTemplate: config.emailTemplates + 'achievementRejected.jade'
    });
    achivmentRej.save(function (err, data) {
        console.log(err || data);
    })


}

createAdminGroup();
createStudentGroup();
regitstryTemplates();

