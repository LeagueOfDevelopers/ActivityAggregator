var fs = require('fs');
var path = require('path');
var Student = require('../db/mongoose').models.Student;
module.exports = {
  login: login,
};

function login(req, res, next) {
  console.log(req.body);
  Student.find({email: req.body.email}, function(err, student) {
    if(err) {
      console.log(err)
    } else {
      res.send(student.hashPassword == req.body.password ? 'ok' : 'not ok');
    }
  })
};




