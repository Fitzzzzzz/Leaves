const serverEnv = require('../../serverEnv'),
			response = require('../../utils/response');

async function list (req, res) {
	let db = req.db, col, docs;

	try {
		col = await db.collection(serverEnv.dbInfo.leavesCol);
		docs = await col.find({"request_id": req.query.requestId}).toArray();
		db.close();
		res.send(response(10000, 'success', docs));
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
}

module.exports.list = list;