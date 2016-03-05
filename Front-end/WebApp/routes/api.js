var router = require('express').Router();
var user = require('../api/user');
var students = require('../api/students');
var achivments = require('../api/achivments');



router.get('/students/:id', students.getStudentDetail);
router.get('/students/search_by_category/:searchParams', students.getStudentsListByCategory);
router.get('/students/search_by_name/:searchParams', students.getStudentsListByName);
router.get('/students/:student_id/achivments', achivments.getAchivmentsList);
router.get('/achivments/:id', achivments.getAchivmentDetail);

router.post('/login', students.login);
router.post('/students/', students.addStudent);
router.post('/students/:id/avatar', students.changeAvatar);
router.post('/students/:id', students.updateStudentDetail);
router.post('/students/:id/achivments', achivments.newAchivment);


module.exports = router;
