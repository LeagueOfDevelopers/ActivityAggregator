
var validationMethods = {}

function require(req, res, next, requiredParams, requiredBody) {

	var invalid = [];

	if(requiredParams) {

		requiredParams.forEach(function(field) {
				if(!req.params[field] || (req.params[field] && validationMethods[field]) && !validationMethods[field](req.params[field]))
				{
					invalid.push('invalid param ' + field)
				}
			})

 	};

	if(requiredBody) {

		requiredBody.forEach(function(field) {
				if(!req.body[field] || (req.body[field] && validationMethods[field]) && !validationMethods[field](req.body[field]))
				{
					invalid.push('invalid body field ' + field)
				}
			})
	 }

	 if(invalid.lehgth != 0) {
	 	res.send({invalid: invalid});
	 } else {
	 	next();
	 }

};

function registryValidationPolicy(fieldName, func) {
	validationMethods[feildName] = func;
};

module.exports = {
	registryValidationPolicy: registryValidationPolicy,
	require: require
};