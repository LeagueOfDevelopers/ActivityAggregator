var router = require('express').Router();
var admin = require('../api/admin');
var students = require('../api/students');
var achivments = require('../api/achivments');

router.get('/students/', students.getStudentsList);
router.get('/students/:id', students.getStudentDetail);
router.get('/students/search_by_category/:searchParams', students.getStudentsListByCategory);
router.get('/students/search_by_name/:searchParams', students.getStudentsListByName);
router.get('/students/:student_id/achivments', achivments.getAchivmentsList);
router.get('/achivments/:id', achivments.getAchivmentDetail);
router.get('/adm/requests', admin.getUncheckedRequests);
router.get('/auth/update', students.updateSession);

router.post('/admin/confirm/:id', admin.confirmAchivment)
router.post('/admin/unConfirm/:id', admin.unConfirmAchivment)
router.post('/admin/invite', admin.getInviteCode)
router.post('/admin/login', admin.login);
router.post('/admin', admin.newAdmin);
router.post('/auth/isAuth', students.isAuth);
router.post('/auth/logout', students.logout);
router.post('/login', students.login);
router.post('/students/', students.addStudent);
router.post('/students/:id/avatar', students.changeAvatar);
router.post('/students/:id', students.updateStudentDetail);
router.post('/students/:id/achivments', achivments.newAchivment);


module.exports = router;
