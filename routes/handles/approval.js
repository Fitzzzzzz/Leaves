const serverEnv =require('../../serverEnv'),
			response = require('../../utils/response'),
			ObjectId = require('mongodb').ObjectId,
			assert = require('assert');

async function list (req, res) {
	let db = req.db, leader, employees, query = req.query, leaves;
	let operatorId = query.operatorId;
	try {
		leader = await db.collection(serverEnv.dbInfo.departmentCol);
		employees = await leader.find({"leader_employee_id": operatorId}).toArray();
		let tem = employees[1].member_employee_ids;
		// console.log(tem);
		leaves = await db.collection(serverEnv.dbInfo.leavesCol).find({
			request_id: {
				$in: tem
			}
		}).toArray();
		res.send(response(10000, 'success', leaves));
	} catch (err) {
		console.log(err.stack);
		res.status(500).end();
	}
}

async function comment (req, res) {
	let db = req.db, col, body = req.body, doc;
	let itemId = body.itemId,
		uid = body.uid,
		name = body.name,
		time = body.time,
		content = body.content;
	try {
		col = await db.collection(serverEnv.dbInfo.leavesCol);
		doc = await col.find({_id: ObjectId(itemId)}).toArray();
		doc[0].comments.push(addComment(uid, content));
		console.log(doc[0].comments);
		db.close();
		res.send(response(10000, 'success'));
	} catch (err) {
		console.log(err.stack);
		res.status(500).end();
	}
}

function addComment (uid, content) {
	let comment = {};
	[comment["comment_id"], comment["comment"]] = [uid, content];
	return comment;
}

module.exports.list = list;
module.exports.comment = comment;