var router = require('express').Router();
var admin = require('../api/admin');
var students = require('../api/students');
var achivments = require('../api/achivments');
var multiparty = require('multiparty');

router.get('/students/', students.getStudentsList);
router.get('/students/:id', students.getStudentDetail);
router.get('/students/search_by_category/:searchParams', students.getStudentsListByCategory);
router.get('/students/search_by_name/:searchParams', students.getStudentsListByName);
router.get('/students/:student_id/achivments', achivments.getAchivmentsList);
router.get('/students/:student_id/achivments/:ach_id', achivments.getAchivmentDetail);
router.get('/adm/requests', admin.getUncheckedRequests);
router.get('/auth/update', students.updateSession);
router.get('/admin/registryRequests', admin.getUncheckedStudents);
router.get('/studentsL/last', students.getLast);

router.post('/admin/registry/', admin.registryByInvite)
router.post('/admin/invite/:id', admin.getInviteCode)
router.post('/admin/confirm/:id', admin.confirmAchivment)
router.post('/admin/unconfirm/:id', admin.unConfirmAchivment)
router.post('/admin/confirmStudent/:id', admin.confirmStudent)
router.post('/admin/rejectStudent/:id', admin.rejectStudent)
router.post('/admin/login', admin.login);
router.post('/admin', admin.newAdmin);	
router.post('/auth/isAuth', students.isAuth);
router.post('/auth/logout', students.logout);
router.post('/login', students.login);
router.post('/students/', students.addStudent);
router.post('/students/:id/avatar', students.changeAvatar);
router.post('/students/:id', students.updateStudentDetail);
router.post('/students/:id/achivments', achivments.newAchivment);
router.post('/students/:id/achivments/file', achivments.addFile);



module.exports = router;
