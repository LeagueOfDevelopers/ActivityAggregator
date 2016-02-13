var router = require('express').Router();
var user = require('../api/user');
var students = require('../api/students');
var achivments = require('../api/achivments')

router.get('/students/:id', students.getStudentDetail);
router.get('/students/search_by_category/:searchParams', students.getStudentsList);
router.get('/students/search_by_name/:searchParams', students.getStudentsList);
router.get('/students/:student_id/achivments', achivments.getAchivmentsList);
router.get('/students/:student_id/achivments/:id', achivments.getAchivmentDetail);

router.post('/user/:id', user.updateUserDetail);
router.post('/user/:id/achivments', user.addAchivment);
router.post('/user/:id/achivments/:ach_id', user.updateAchivmentDetail);


module.exports = router;
