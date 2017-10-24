const response = require('../../utils/response'),
			serverEnv = require('../../serverEnv'),
			leavesSchame = require('../../utils/leaves.schame'),
			assert = require('assert');

async function add (req, res) {
	let db = req.db, col, row, result;
	try {
		col = await db.collection(serverEnv.dbInfo.leavesCol);
		row = await col.insertOne(leavesSchame);
		assert.equal(1, row.insertedCount);
		result = row.insertedCount === 1 ? response(10000, 'insert succeed') : response(10003, 'insert error')
		res.send(result);
	} catch (err) {
		console.log(err.stack);
		res.status(500).end();
	}
	db.close();
}

async function detail (req, res) {
	let db = req.db, col, docs, result;
	try {
		col = await db.collection(serverEnv.dbInfo.leavesCol);
		docs = await col.find().toArray();
		res.send(response(10000, '', docs));
	} catch (err) {
		console.log(err.stack);
		res.status(500).end();
	}
}

module.exports.add = add;
module.exports.detail = detail;