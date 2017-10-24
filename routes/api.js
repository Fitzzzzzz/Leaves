const express = require('express'),
			router = express.Router(),
			MongoClient = require('mongodb').MongoClient,
			co = require('co'),
			assert = require('assert'),
			colors = require('colors'),
			serverEnv = require('../serverEnv'),
			md5 = require('md5');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'red',
	info: 'green',
	data: 'blue',
	help: 'cyan',
	warn: 'yellow',
	debug: 'magenta',
	error: 'red'
});

router.get('/', (req, res) => {
	co(function* () {
		let db = yield MongoClient.connect(`${serverEnv.mongoHost}:${serverEnv.mongoPort}/${serverEnv.dbInfo.dbName}`);
		console.log('Connected correctly to server'.data);
		let docs = yield db.collection(serverEnv.dbInfo.employeeCol).find().toArray();
		// console.log(r, 'not in yield');
		// assert.equal(3, docs.length)
		console.log('in /api/');
		res.send(docs);
		db.close();
	}).catch(err => console.log(err.stack));
});

// router.get('/md5', (req, res) => {
// 	async function getAllEmployees () {
// 		let db = req.db, docs, col;
// 		try {
// 			col = await db.collection(serverEnv.dbInfo.employeeCol);
// 			docs = await col.find().toArray();
//
// 			console.log('in /api/md5');
// 			for (let i in docs) {
// 				let change = await col.updateOne({ _id: docs[i]._id }, { $set: { passwd: md5(docs[i].passwd) } });
// 				console.log(change);
// 			}
// 			// console.log(docs[0].passwd);
// 			db.close();
// 			res.status(200).end()
// 		} catch (err) {
// 			console.log(err.stack);
// 			res.status(500).end();
// 		}
// 	}
// 	getAllEmployees();
// });
router.get('/test', (req, res) => {
	res.send(`${serverEnv.mongoHost}:${serverEnv.mongoPort}/${serverEnv.dbName}`)
});
module.exports = router;
