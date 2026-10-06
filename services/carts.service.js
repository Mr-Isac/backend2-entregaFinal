import CartsRepository from "../repositories/carts.repository.js";

class CartsService {

  constructor() {
    this.repository = new CartsRepository();
  }

  async create() {
    return await this.repository.create();
  }

  async getById(id) {
    return await this.repository.getById(id);
  }

  async getByIdWithProducts(id) {
    return await this.repository.getByIdWithProducts(id);
  }

  async addProduct(cartId, productId) {

    const cart = await this.repository.getById(
      cartId
    );

    if (!cart) {
      return null;
    }

    const product = cart.products.find(
      function (item) {
        return item.product.toString() === productId;
      }
    );

    if (product) {

      product.quantity++;

    } else {

      cart.products.push({
        product: productId,
        quantity: 1
      });

    }

    return await cart.save();
  }

  async removeProduct(cartId, productId) {

    const cart = await this.repository.getById(
      cartId
    );

    if (!cart) {
      return null;
    }

    cart.products = cart.products.filter(
      function (item) {
        return item.product.toString() !== productId;
      }
    );

    return await cart.save();
  }

  async updateProducts(cartId, products) {

    return await this.repository.update(
      cartId,
      {
        products
      }
    );
  }

  async updateProductQuantity(
    cartId,
    productId,
    quantity
  ) {

    const cart = await this.repository.getById(
      cartId
    );

    if (!cart) {
      return null;
    }

    const product = cart.products.find(
      function (item) {
        return item.product.toString() === productId;
      }
    );

    if (!product) {
      return false;
    }

    product.quantity = quantity;

    return await cart.save();
  }

  async clearCart(cartId) {

    return await this.repository.update(
      cartId,
      {
        products: []
      }
    );
  }

}

export default CartsService;