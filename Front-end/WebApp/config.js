module.exports.files = {
	achivmentsDocs: {
		path: './public/storage/students/',
		link: './storage/students/',
		types: ['image/png', 'image/jpg', 'image/jpeg']
	},
	students: {
		avatar : {
			path: './public/storage/students/',
			link: './storage/students/',
			types: ['image/png', 'image/jpg', 'image/jpeg']
		}
	}
};

module.exports.db = {
	string: 'mongodb://localhost/aggregator'
}

module.exports.BASE_URL = 'localhost:3000';