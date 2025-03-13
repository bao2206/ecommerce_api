const MainService = require("../service/user_service");
const jwt = require('jsonwebtoken');
// const fs = require("fs");
// const path = require("path");

class UserController {
  // Logout = async(req, res, next) =>{
   
  //   //logout cookie 
  //   try {
  //     // Clear the cookie that stores the user's session
  //     removeCookie(res, "user");
  //     return res.status(200).json({ success: true, message: "Logged out successfully." });
  //   } catch (error) {
  //     console.log("Catch")
  //     console.error("Error during logout:", error);
  //     return res.status(500).json({ success: false, message: "Error server, please try again." });
  //   }
  // }
 
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
    
  }

}

module.exports = new UserController();
