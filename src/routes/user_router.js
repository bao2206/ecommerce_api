var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user_controller');
const {asyncHandle} =  require("../utils/asyncHandle");
const authMiddleware = require("../middlewares/authMiddleware");
// console.log('acount')
router.post('/signup', asyncHandle(UserController.SignUp));
// console.log('sigin')
router.get('/logout', asyncHandle(UserController.Logout));

router.post('/signin', asyncHandle(UserController.SignIn));
router.put("/profileupdate", authMiddleware, asyncHandle(UserController.updateProfile));
router.get("/profile", authMiddleware, asyncHandle(UserController.getProfile));
router.put("/change-password", authMiddleware, asyncHandle(UserController.changePassword));
module.exports = router;