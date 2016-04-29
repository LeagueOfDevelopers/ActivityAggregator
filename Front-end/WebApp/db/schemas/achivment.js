
var achivment = new schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	owner_id: {
		type: String,
		required: true
	},
	organization: {
		type: String,
		required: true
	},
	level: {
		type: String,
		required: true
	},
	result: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	photos: [{type: String}],
	files: [{type: String, required: true}],
	checked: {
		type: Boolean,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	message: {
		type: String
	}
});

module.exports = achivment;
