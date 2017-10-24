const response = require('../../utils/response'),
			serverEnv = require('../../serverEnv'),
			leavesSchame = require('../../utils/leaves.schame'),
			assert = require('assert');

async function add (req, res) {
	let db = req.db, body = req.body, col, row, result;
	let requestId = body.requestId,
			hours = body.hours,
			startTime = body.startTime,
			finishTime = body.finishTime,
			type = body.type,
			comment = body.comment;
	if (!requestId || !hours || !startTime || !finishTime || !type || !comment) {
		return res.send(response(10004, 'Params not enough'))
	}
	try {
		col = await db.collection(serverEnv.dbInfo.leavesCol);
		let leave = setLeavesSchame(requestId, hours, startTime, finishTime, type, comment);
		row = await col.insertOne(leave);
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

function setLeavesSchame (...params) {
	let leave = leavesSchame;
	let comment = {
		comment_id: null,
		comment: ''
	};
	[leave.request_id, leave.info.hours, leave.info.from, leave.info.to, leave.info.kind, comment.comment] = params;
	leave.status = 'padding';
	leave.info.reason = params[params.length-1];
	comment.comment_id = params[0];
	leave.comments.push(comment);
	return leave;
}

module.exports.add = add;
module.exports.detail = detail;