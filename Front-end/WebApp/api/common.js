module.exports = {
	modelParse: modelParse
};

function modelParse(model, form) {

	Object.getOwnPropertyNames(model).forEach(function(key) {
		if(!form[key]) {
			res.end('model parsing error, field ' + key);
			model = null;
			return;
		}
    model[key] = form[key];
 });

return  model;
}