const express = require('express'),
			router = express.Router(),
			request = require('../handles/request'),
			list = request.list;

router.get('/list', (req, res) => {
	list(req, res);
});

module.exports = router;