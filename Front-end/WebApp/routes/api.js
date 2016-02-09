var router = require('express').Router();
var user = require('../api/user');

router.get('/user/:id', user.getUserDetail);
router.get('/user/:id/achivments', user.getAchivmentsList);
router.get('/user/:id/achivments/:ach_id', user.getAchivmentDetail);

router.post('/user/:id', user.updateUserDetail);
router.post('/user/:id/achivments', user.addAchivment);
router.post('/user/:id/achivments/:ach_id', user.updateAchivmentDetail);


module.exports = router;
