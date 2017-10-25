const express = require('express'),
			router = express.Router(),
			leavesHandler = require('../handles/leaves'),
			add = leavesHandler.add,
			detail = leavesHandler.detail,
			reset = leavesHandler.reset,
			handleLeave = leavesHandler.handleLeave;

router.post('/add', (req, res) => {
	add(req, res);
});

router.get('/detail', (req, res) => {
	detail(req, res);
});

router.post('/reset', (req, res) => {
	reset(req, res)
});

router.post('/handle', (req, res) => {
	handleLeave(req, res);
});
module.exports = router;