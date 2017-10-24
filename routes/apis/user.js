const express = require('express'),
			router = express.Router(),
			login = require('../handles/user').Login;

router.post('/login', (req, res) => {
	login(req, res);
});

module.exports = router;