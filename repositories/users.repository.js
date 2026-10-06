import UsersDAO from "../dao/users.dao.js";

class UsersRepository {

  constructor() {
    this.dao = new UsersDAO();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async getByEmail(email) {
    return await this.dao.getByEmail(email);
  }

  async findByResetToken(token) {
    return await this.dao.findByResetToken(token);
  }

  async create(userData) {
    return await this.dao.create(userData);
  }

  async update(id, userData) {
    return await this.dao.update(
      id,
      userData
    );
  }

}

export default UsersRepository;