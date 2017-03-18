var express = require('express');
var router = express.Router();

router.get('/', function (request, response) {
	response.sendfile('views/map.html');
});
router.get('/debug', function (request, response) {
	response.sendfile('views/forms.html')
});
router.get('/map', function (request, response) {
	response.sendfile('views/map.html');
});
router.get('/search', function (request, response) {
	response.sendfile('views/search.html');
});

router.get('/profile/:node', function (request, response) {
	response.sendfile('views/node-profile.html');
});

module.exports = router;