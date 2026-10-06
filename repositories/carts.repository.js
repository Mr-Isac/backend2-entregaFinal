import CartsDAO from "../dao/carts.dao.js";

class CartsRepository {

  constructor() {
    this.dao = new CartsDAO();
  }

  async create() {
    return await this.dao.create();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async getByIdWithProducts(id) {
    return await this.dao.getByIdWithProducts(id);
  }

  async update(id, cartData) {
    return await this.dao.update(
      id,
      cartData
    );
  }

}

export default CartsRepository;