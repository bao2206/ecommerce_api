var express = require('express');
var router = express.Router();

/* GET home page. */
router.use("/slider" , require("./slider_router"));
// router.get('/', function(req, res, next) {
//   res.status(200).json({})
// });

module.exports = router;
