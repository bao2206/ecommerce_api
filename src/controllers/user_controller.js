const MainService = require("../service/user_service");
const jwt = require('jsonwebtoken');
// const fs = require("fs");
// const path = require("path");
const redis = require("../utils/redis");

class UserController {
  Logout = async(req, res, next) =>{
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if(!token) throw new Error("Token is required.");


    const decoded = jwt.decode(token);
    const exp = decoded?.exp;

    if(!exp) throw new Error("Invalid token.");

    const ttl = exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.setex(`blacklist:${token}`, ttl, "blacklisted"); 
    }
    return res.status(200).json({ message: "Logout successful" });
  }
 
  SignUp = async(req, res, next) =>{

   
      const {username, email, password, phone} = req.body;
      const existingUser = await Promise.all([
        MainService.checkUserByEmail({ email }),
        MainService.checkUserByUsername({ username }),
        MainService.checkPhoneExist({phone})
      ]);
      
      const [existingUserEmail, existingUsername, existingPhone] = existingUser;

      if(existingUserEmail) throw new Error("Email already in use.");
      if(existingUsername) throw new Error("Username already in use.");
      if (existingPhone) throw new Error("Phone already in use.");

      const newUser = await MainService.createAccount(username, email, password, phone);

      if(!newUser) throw new Error("Cannot create a new account.");

      // const token = newUser.generateToken();
      console.log("check")
      return res.status(201).json({
        message: "Successful.",
        data: {
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            phone: newUser.phone
          },
          // token
        }
      });
  }
  SignIn = async(req, res, next) => {
    const {emailOrUsername, password} = req.body;
    const user = await MainService.checkUserByEmailOrUsername({emailOrUsername});
    console.log(user);
    if(!user) throw new Error("User not found.");

    const isMatch = await user.comparePassword(password);
    if(!isMatch) throw new Error("Invalid password.");
    const token = jwt.sign(
      {id: user._id, email: user.email, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  }
  getProfile = async(req, res, next) => {
    const userId = req.user.id;
    const user = await MainService.getUserById(userId);
    if(!user) throw new Error("User not found.");
    return res.status(200).json({"Get user successfully": user});
  }
  updateProfile = async(req, res, next) => {
    const userId = req.user.id;
    const updatedData = req.body;

    const updatedUser = await MainService.updateUserById(userId, updatedData);

    if(!updatedUser) throw new Error("Cannot update user.");
    return res.status(200).json({"Update user successfully": updatedUser});
  }
  changePassword = async(req, res, next) => {
    const userId = req.user.id;
    const {oldPassword, newPassword} = req.body;
    const user = await MainService.findUserById(userId);
    console.log(user);
    if(!user) throw new Error("User not found.");
    const isMatch = await user.comparePassword(oldPassword);
    if(!isMatch) throw new Error("Invalid password.");
    user.password = newPassword;
    await user.save();
    return res.status(200).json({"Change password successfully": user});
  } 
}

module.exports = new UserController();
