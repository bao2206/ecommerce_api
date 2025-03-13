const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const ConnectionDocument = "Accounts";
const ModelDocument = "account";
const jwt = require('jsonwebtoken');
const {ErrorCustom} = require('../core/errorCustom');
require('dotenv').config();

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/;

const accountSchema = new Schema(
  {
    username: {type: String,
      required:[true,'Name is required'], 
      trim: [true, "Name must not contain leading or trailing spaces"],
      min: 0, 
      max: 50 },
    email: {type: String, 
        required: [true, "Email is required"], 
        unique: [true, "Email is already taken"], 
        lowercase: true,
        trim: [true, "Email must not contain leading or trailing spaces"],
        validate:{
            validator:(v) => emailRegex.test(v),
            message:"Email is invalid"
        }},
    status: {type: String, enum: ["active", "inactive"], default: "active"},
    password: {type: String, required:[true,"Password is required"], 
      min: [8, "Password must be at least 8 characters long"],
      trim: [true, "Password must not contain leading or trailing spaces"],
      validate:{
        validator:(v) => /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(v),
        message:"Password must contain at least one number and one special character"
      }
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    is_active: {type: String, enum:["active", "inactive"], default: "active"},
   
    full_name: {type: String, 
      // required: [true, "Full name is required"]
    },
    phone:{type: String, 
      // required:[true,"Phone is required"], 
      unique: [true, "Phone is already taken"],
      validate:{
        validator:(v) => phoneRegex.test(v),
        message:"Phone is invalid. Please enter a valid phone number of Viet Nam"
      }
    },
    date_of_birth: {type: Date},
    address: {
      street: {type: String, 
        // required: true
        },
      city: {type: String, 
        // required: true
      },
      country: {type: String, 
        // required: true
      },
      postal_code: {type: String, 
        // required: true
      }
    },
    avatar: {type: String}, 
  },
  { collection: ConnectionDocument, timestamps: true }
);
accountSchema.pre('save', async function(next){
  const user =  this;

  if(!user.isModified('password')) return next();

  try{
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR,10));
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch(error){
    next(error);
  }
});
accountSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword, this.password);
}


accountSchema.methods.generateToken = function(){
  try {
    return jwt.sign(
      {id: this._id, email: this.email, role: this.role}, 
      process.env.JWT_SECRET, 
      {expiresIn: process.env.JWT_EXPIRES_IN});
  } catch (error) {
    throw new ErrorCustom("Error during generate token", 500);
  }
}

module.exports = mongoose.model(ModelDocument, accountSchema);
