const response = require('../../utils/response'),
			md5 = require('md5'),
			serverEnv = require('../../serverEnv');

async function login (req, res) {
	let email = req.body.email,
		passwd = req.body.password;
	let db = req.db, doc, col, result;
	try {
		col = await db.collection(serverEnv.dbInfo.employeeCol);
		doc = await col.find({ email: email }).toArray();
		if (doc.length) {
			result = doc[0].passwd === md5(md5(passwd)) ? response(10000, doc) : response(100003, 'password err');
		} else {
			result = response(10004, 'not found');
		}
		db.close();
		res.send(result);
	} catch (err) {
		console.log(err.stack);
		res.status(500).end();
	}
}

module.exports.Login = login;