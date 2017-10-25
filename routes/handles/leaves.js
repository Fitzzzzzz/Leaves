const response = require('../../utils/response'),
			serverEnv = require('../../serverEnv'),
			leavesSchame = require('../../utils/leaves.schame'),
			assert = require('assert'),
			ObjectId = require('mongodb').ObjectId;

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
		leave.histories.push(addHistory(requestId, 'creation'));
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
		db.close();
		res.send(response(10000, '', docs));
	} catch (err) {
		console.log(err.stack);
		res.status(500).end();
	}
}

async function reset (req, res) {
	let db = req.db, col, change, body = req.body, doc;
	let itemId = body.itemId,
		userId = body.userId,
		name = body.name,
		startTime = body.startTime,
		finishTime = body.finishTime,
		hours = body.hours,
		type = body.type;
	try {
		col = await db.collection(serverEnv.dbInfo.leavesCol);
		doc = await col.find({"_id": ObjectId(itemId)}).toArray();
		console.log(doc);
		if(doc.length === 0) return res.send(response(10004, 'not found'));
		[doc[0].info.hours, doc[0].info.kind, doc[0].info.from, doc[0].info.to] = [hours, type, startTime, finishTime];
		change = await col.findOneAndReplace({"_id": ObjectId(itemId)}, doc[0]);
		// assert.equal(1, change.modifiedCount);
		console.log(change);
		db.close();
		res.send(response(10000, 'success'));
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
async function handleLeave (req ,res) {
	let db = req.db, doc, change, col, body = req.body;
	let itemId = body.itemId,
		userId = body.userId,
		status = body.status;
	col = await db.collection(serverEnv.dbInfo.leavesCol);
	doc = await col.find({"_id": ObjectId(itemId)}).toArray();
	doc[0].status = status;
	// console.log(addHistory(userId));
	doc[0].histories.push(addHistory(userId, 'leader'));
	change = await col.findOneAndReplace({"_id": ObjectId(itemId)}, doc);
	console.log(change);
	db.close();
	res.send(response(10000, 'success'));
}
function addHistory (userId, kind) {
	let history = {};
	[
		history["kind"],
		history["operator_employee_id"],
		history["operated_at"]
	] = [
		kind,
		userId,
		new Date()
	];
	return history
}
module.exports.add = add;
module.exports.detail = detail;
module.exports.reset = reset;
module.exports.handleLeave = handleLeave;