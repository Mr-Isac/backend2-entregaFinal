import ProductsRepository from "../repositories/products.repository.js";

class ProductsService {

  constructor() {
    this.repository = new ProductsRepository();
  }

  async getAll(filter = {}, options = {}) {
    return await this.repository.getAll(
      filter,
      options
    );
  }

  async getById(id) {
    return await this.repository.getById(
      id
    );
  }

  async create(productData) {
    return await this.repository.create(
      productData
    );
  }

  async update(id, productData) {
    return await this.repository.update(
      id,
      productData
    );
  }

  async delete(id) {
    return await this.repository.delete(
      id
    );
  }

  async decreaseStock(id, quantity) {
    return await this.repository.decreaseStock(
      id,
      quantity
    );
  }

}

export default ProductsService;