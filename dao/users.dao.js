import User from "../models/User.js";

class UsersDAO {

  async getById(id) {
    return await User.findById(id).populate("cart");
  }

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token
    });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(
      id,
      userData,
      { new: true }
    );
  }

}

export default UsersDAO;