module.exports = {
  getUserDetail: getUserDetail,
  updateUserDetail: updateUserDetail,
  addAchivment: addAchivment,
  getAchivmentsList: getAchivmentsList,
  getAchivmentDetail: getAchivmentDetail,
  updateAchivmentDetail: updateAchivmentDetail
};;

function getUserDetail(req, res, next) {
  var data = JSON.stringify({
    user: {
            firstName: 'Жамбыл',
            lastName: 'Ермагамбет',
            department: 'ИТАСУ',
            course: '2',
            about: 'Задача организации, в особенности же рамки и место обучения кадров позволяет выполнять важные задания по разработке соответствующий условий активизации. Мы хотим, чтобы наш вейп-шоп был удобен и полезен для всех категорий покупателей. вас все замечания и предложения о товаре, ценах, а главное — о сайте отправлять.',
            photoUri: '../img/jambul.jpg',
            achivments: [{name:'Победа в квн', id: '12', type: 'sport'}, {name:'Победаdwd в квн', id: '12', type: 'sport'}, {name:'Победаqwdq в квн', id: '12', type: 'sport'}, {name:'Побеdwdда в квн', id: '12', type: 'sport'}]
          },
    status: 200

  });
  res.end(data);
};

function updateUserDetail(req, res, next) {
  var data = req.data;
  res.end('updateUserDetail' + req.params.id);
};

function addAchivment(req, res, next) {
  var data = req.data;
  res.end('addAchivment');

};

function updateAchivmentDetail(req, res, next) {
  var data = req.data;
  res.end('updateAchivmentDetail' + req.params.id);

};

function getAchivmentsList(req, res, next) {
  res.end('getAchivmentsList' + req.params.id)
};

function getAchivmentDetail(req, res, next) {
  res.end('getAchivmentDetail' + req.params.id)

};
