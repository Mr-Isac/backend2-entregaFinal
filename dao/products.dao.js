import Product from "../models/Product.js";

class ProductsDAO {

  async getAll(filter = {}, options = {}) {
    return await Product.paginate(
      filter,
      options
    );
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async create(productData) {
    return await Product.create(
      productData
    );
  }

  async update(id, productData) {
    return await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true }
    );
  }

  async delete(id) {
    return await Product.findByIdAndDelete(
      id
    );
  }

  async decreaseStock(id, quantity) {

    return await Product.findOneAndUpdate(
      {
        _id: id,
        stock: { $gte: quantity }
      },
      {
        $inc: {
          stock: -quantity
        }
      },
      {
        new: true
      }
    );
  }

}

export default ProductsDAO;