var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user_controller');
const {asyncHandle} =  require("../utils/asyncHandle");
const authMiddleware = require("../middlewares/authMiddleware");
// console.log('acount')
router.post('/signup', asyncHandle(UserController.SignUp));
// console.log('sigin')
// router.post('/logout', asyncHandle(UserController.Logout));
router.post('/signin', asyncHandle(UserController.SignIn));
router.put("/profile", authMiddleware, asyncHandle(UserController.updateProfile));
router.get("/profile", authMiddleware, asyncHandle(UserController.getProfile));
module.exports = router;