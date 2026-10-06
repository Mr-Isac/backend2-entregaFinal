import Cart from "../models/Cart.js";

class CartsDAO {

  async create() {
    return await Cart.create({
      products: []
    });
  }

  async getById(id) {
    return await Cart.findById(id);
  }

  async getByIdWithProducts(id) {
    return await Cart.findById(id).populate(
      "products.product"
    );
  }

  async update(id, cartData) {
    return await Cart.findByIdAndUpdate(
      id,
      cartData,
      { new: true }
    );
  }

}

export default CartsDAO;