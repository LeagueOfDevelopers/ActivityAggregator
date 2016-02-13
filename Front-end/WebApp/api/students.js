module.exports = {
	getStudentDetail: getStudentDetail,
	getStudentsList: getStudentsList
};

function getStudentDetail(req, res, next) {
  var data = JSON.stringify({
    info: {
    		id: '1',
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

function getStudentsList(req, res, next) {
	console.log(req.params.searchParams);
	var data = JSON.stringify([
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12'}, {name:'Победаdwd в квн', id: '12'}, {name:'Победаqwdq в квн', id: '12'}, {name:'Побеdwdда в квн', id: '12'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12'}, {name:'Победаdwd в квн', id: '12'}, {name:'Победаqwdq в квн', id: '12'}, {name:'Побеdwdда в квн', id: '12'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12'}, {name:'Победаdwd в квн', id: '12'}, {name:'Победаqwdq в квн', id: '12'}, {name:'Побеdwdда в квн', id: '12'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12'}, {name:'Победаdwd в квн', id: '12'}, {name:'Победаqwdq в квн', id: '12'}, {name:'Побеdwdда в квн', id: '12'}]
        }
        ]);

	res.end(data);

};