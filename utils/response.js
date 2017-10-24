
const response = function (code, message = '', data = []) {
	let obj = {};
	[obj['code'], obj['data'], obj['message']] = [code, data, message];
	return obj;
};

module.exports = response;