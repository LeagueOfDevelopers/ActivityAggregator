var test = require('../db/mongoose');
module.exports = {
	getStudentDetail: getStudentDetail,
	getStudentsList: getStudentsList,
  testBD: testBD

};



function testBD(req, res, next) {
    return test.find(function (err, data) {
        if (!err) {
            return console.log(data);
        } else {
            res.statusCode = 500;
            nsole.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    }
  }

function getStudentDetail(req, res, next) {
  var data = JSON.stringify({
    data: {
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

function getStudentsList(req, res, next) {
	console.log(req.params.searchParams);
	var data = JSON.stringify([
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [
          {name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        ]);

	res.end(data);

};