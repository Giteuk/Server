var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();



module.exports = router;