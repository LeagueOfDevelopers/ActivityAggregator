var router = require('express').Router();
var admin = require('../api/admin');
var students = require('../api/students');
var achivments = require('../api/achivments');
var multiparty = require('multiparty');
var mail = require('../api/mailer');

router.post('/auth/isAuth', students.isAuth);
router.post('/auth/logout', students.logout);


router.get('/auth/update', students.updateSession);
router.get('/students/', students.getStudentsList);
router.get('/students/:id', students.getStudentDetail);
router.get('/students/search_by_category/:searchParams', students.getStudentsListByCategory);
router.get('/students/search_by_name/:searchParams', students.getStudentsListByName);
router.get('/students/:student_id/achivments', achivments.getAchivmentsList);
router.get('/students/:student_id/achivments/:ach_id', achivments.getAchivmentDetail);
router.post('/students/', students.addStudent);

router.post('/students/recovery', students.generateRecoveryToken);
router.post('/students/newPassword', students.recovery);
router.post('/students/checkRecoveryToken', students.checkRecoveryToken);
router.post('/login', students.login);
router.post('/students/:id/*', students.isStudent);
router.post('/students/:id/newPassword', students.changePassword);
router.post('/students/:id/avatar', students.changeAvatar);
router.post('/students/:id', students.updateStudentDetail);
router.post('/students/:id/achivments', achivments.newAchivment);
router.post('/students/:id/achivments/file', achivments.addFile);

router.get('/adm/requests', admin.isAdmin, admin.getUncheckedRequests);
router.get('/admin/registryRequests', admin.isAdmin, admin.getUncheckedStudents);
router.get('/studentsL/last', students.getLast);
router.post('/admin/confirm/:id', admin.isAdmin, admin.confirmAchivment);
router.post('/admin/unconfirm/:id', admin.isAdmin, admin.unConfirmAchivment);
router.post('/admin/confirmStudent/:id', admin.isAdmin, admin.confirmStudent);
router.post('/admin/rejectStudent/:id', admin.isAdmin, admin.rejectStudent);

router.get('/admin/update', admin.updateSession);
router.post('/admin/registry/', admin.registryByInvite);
router.post('/admin/invite/:id', admin.isAdmin, admin.getInviteCode);
router.post('/admin/login', admin.login);
router.post('/admin', admin.newAdmin);	

router.post('/mailTest/:text', mail.send);

module.exports = router;
