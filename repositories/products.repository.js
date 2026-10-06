import ProductsDAO from "../dao/products.dao.js";

class ProductsRepository {

  constructor() {
    this.dao = new ProductsDAO();
  }

  async getAll(filter = {}, options = {}) {
    return await this.dao.getAll(
      filter,
      options
    );
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async create(productData) {
    return await this.dao.create(
      productData
    );
  }

  async update(id, productData) {
    return await this.dao.update(
      id,
      productData
    );
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async decreaseStock(id, quantity) {
    return await this.dao.decreaseStock(
      id,
      quantity
    );
  }

}

export default ProductsRepository;
