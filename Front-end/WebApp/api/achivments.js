fs = require('fs');

module.exports = {
  	getAchivmentsList: getAchivmentsList,
  	getAchivmentDetail: getAchivmentDetail,
  	newAchivment: newAchivment
};

function getAchivmentsList(req, res, next) {
  res.end('getAchivmentsList' + req.params.student_id + ' ');
};

function getAchivmentDetail(req, res, next) {
  res.end('getAchivmentDetail' + ' ' + req.params.id);

};

function newAchivment(req, res, next) {
	res.end('newAchivment');
};