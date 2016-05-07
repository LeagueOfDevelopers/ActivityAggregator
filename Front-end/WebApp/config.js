module.exports.files = {
	achivmentsDocs: {
		path: './public/storage/students/',
		link: './storage/students/',
		types: ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'],
		maxSize: 1024 * 1024 * 2
	},
	students: {
		avatar : {
			path: './public/storage/students/',
			link: './storage/students/',
			types: ['image/png', 'image/jpg', 'image/jpeg',  'application/pdf']
		}
	}
};

module.exports.db = {
	string: 'mongodb://localhost/aggregator'
}

module.exports.BASE_URL = 'localhost:3000';

module.exports.smtp = {
	login: 'aggregator@lod-misis.ru',
	password: '1qaz2wsx#EDC',
	port: 25,
	host: 'smtp.yandex.ru',
	sender: '"Аггрегатор МИСиС" <aggregator@lod-misis.ru>'
}