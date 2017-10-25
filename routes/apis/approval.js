const express = require('express'),
			router = express.Router(),
			approval = require('../handles/approval'),
			list = approval.list,
			comment = approval.comment;

router.get('/list', (req, res) => {
	list(req, res);
});

router.post('/comment', (req, res) => {
	comment(req, res);
});

module.exports = router;