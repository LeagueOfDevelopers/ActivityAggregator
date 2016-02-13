module.exports = {
  	getAchivmentsList: getAchivmentsList,
  	getAchivmentDetail: getAchivmentDetail,
};

function getAchivmentsList(req, res, next) {
  res.end('getAchivmentsList' + req.params.student_id + ' ');
};

function getAchivmentDetail(req, res, next) {
  res.end('getAchivmentDetail' + ' ' + req.params.student_id + ' ' + req.params.id);

};