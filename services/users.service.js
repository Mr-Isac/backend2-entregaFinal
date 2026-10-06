import bcrypt from "bcrypt";
import UsersRepository from "../repositories/users.repository.js";
import Cart from "../models/Cart.js";

class UsersService {

  constructor() {
    this.repository = new UsersRepository();
  }

  async register(userData) {

    const existingUser = await this.repository.getByEmail(
      userData.email
    );

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const hashedPassword = bcrypt.hashSync(
      userData.password,
      10
    );

    const cart = await Cart.create({
      products: []
    });

    const user = await this.repository.create({
      ...userData,
      password: hashedPassword,
      cart: cart._id
    });

    return user;
  }

  async getByEmail(email) {
    return await this.repository.getByEmail(email);
  }

  async getById(id) {
    return await this.repository.getById(id);
  }

}

export default UsersService;