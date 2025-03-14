const MainModel = require("../models/user_model");
const _ = require("lodash");
class AccountService {
  getAllItems = async (filter) => {
    return await MainModel.find(filter);
  };
  countStatus = async (name = "") => {
    //
    let status = {};
    if (name != "") status = { status: name };
    return await MainModel.countDocuments(status);
  };
  findItem = async (searchTerm, filter) => {
    const test = await MainModel.find({
      ...filter,
      $or: [{ name: { $regex: new RegExp(searchTerm, "ig") } }],
    });
    // console.log(searchTerm, filter, test);
    return test;
  };
  createAccount = async (username, email, password, phone) => {
    return await MainModel.create({ username, email, password, phone });
  };
  checkUserByEmail = async ({ email }) => {
    return await MainModel.findOne({ email });
  };
  checkUserByUsername = async ({ username }) => {
    return await MainModel.findOne({ username });
  };
  checkPhoneExist = async ({ phone }) => {
    return await MainModel.findOne({ phone });
  };
  checkUserByEmailOrUsername = async ({ emailOrUsername }) => {
    const user = await MainModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    return user;
  };
  getRoleOfUser = (user) => {
    return user.role;
  };
  getAllRoles = () => {
    return MainModel.schema.path("role").enumValues;
  };

  getUserById = async (id) => {
    return await MainModel.findById(id).select(
      "-password -role -status -is_active"
    );
  };

  findUserById = async(id) =>{
    return await MainModel.findById(id);
  }
  updateUserById = async (id, data) => {
    const allowedUpdates = _.omit(data, ["username ", "password", "role", "status", "is_active"]);
    return await MainModel.findByIdAndUpdate(id, 
      { $set: allowedUpdates }, 
      { new: true, runValidators: true }
    ).select("-username -password -role -status -is_active");  
  };
}
module.exports = new AccountService();
