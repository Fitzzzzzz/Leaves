const express = require('express'),
			router = express.Router(),
			leavesHandler = require('../handles/leaves'),
			add = leavesHandler.add,
			detail = leavesHandler.detail;

router.post('/add', (req, res) => {
	add(req, res);
});

router.get('/detail', (req, res) => {
	detail(req, res);
});

module.exports = router;