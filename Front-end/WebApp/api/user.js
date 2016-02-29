var fs = require('fs');
var path = require('path');
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
            about: 'Все канавы есть шрамы ночи, что прошиты костями младенцев, зараженными спицами звездного склепа. Сернистая планета испускает благословения, мертвым известны мечты. С мясного крюка я пою песнь о жизни, облетаемой темными метеорами, принесенный в жертву во имя уничтожения человечьей семьи. Песни из воющей головы, кишащей рептильными куклами.',
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


