const MainService = require("../service/user_service");
const jwt = require('jsonwebtoken');
// const fs = require("fs");
// const path = require("path");

class UserControlller {
//   Logout = async(req, res, next) =>{
   
//     //logout cookie 
//     try {
//       // Clear the cookie that stores the user's session
//       removeCookie(res, "user");
//       return res.status(200).json({ success: true, message: "Logged out successfully." });
//     } catch (error) {
//       console.log("Catch")
//       console.error("Error during logout:", error);
//       return res.status(500).json({ success: false, message: "Error server, please try again." });
//     }
//   }
 
  SignUp = async(req, res, next) =>{

   
      const {username, email, password, phone} = req.body;
      const existingUser = await Promise.all([
        MainService.checkUserByEmail({ email }),
        MainService.checkUserByUsername({ username }),
        MainService.checkPhoneExist({phone})
      ]);
      
      const [existingUserEmail, existingUsername, exisitingPhone] = existingUser;

      if(existingUserEmail) throw new Error("Email already in use.");
      if(existingUsername) throw new Error("Username already in use.");
      if (exisitingPhone) throw new Error("Phone already in use.");

      const newUser = await MainService.createAccount(username, email, password, phone);

      // Trả về kết quả
      if (newUser) {
      
        return res.status(201).json({message: "Successful.", data: newUser}); 
      } else {
        throw new Error("Cannot create a new user")
      }
   
  }
  SignIn = async(req, res, next) => {
  const validator = new Validator(req.body);
  
  const isValid = validator.validateLogin();
 
  try {
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Please provide valid email or username and password." });
    }
    // Tìm người dùng theo email hoặc username
    const { emailOrUsername, password } = req.body;
    const existingUser = await MainService.getUserByEmailOrUsername({ emailOrUsername });


    if (!existingUser) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    // So sánh mật khẩu đã nhập với mật khẩu trong cơ sở dữ liệu
    const isPasswordMatch = await existingUser.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password." });
    }
    const roleOfUser = MainService.getRoleOfUser(existingUser);
   
    console.log(roleOfUser);
    // 
    res.cookie('user', JSON.stringify({
      username: existingUser.username,
      email: existingUser.email,
      role: roleOfUser
    }), {
      httpOnly: true,  
      secure: false,   
      maxAge: 3600000, 
      sameSite: 'strict' 
    });
   
    return res.status(201).json({ success: true, message: "Login successful.", user: existingUser });
    // return res.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Server error, please try again." });
    }
  }
  }
}
function removeCookie(res, cookieName) {
  res.cookie(cookieName, "", { expires: new Date(0), path: '/' });
}
module.exports = new UserControlller();
