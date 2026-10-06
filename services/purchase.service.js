import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import TicketsService from "./tickets.service.js";

class PurchaseService {

  constructor() {
    this.cartsRepository = new CartsRepository();
    this.productsRepository = new ProductsRepository();
    this.ticketsService = new TicketsService();
  }

  async purchase(cartId, user) {

    const cart = await this.cartsRepository.getById(
      cartId
    );

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (cart.products.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const purchasedProducts = [];
    const unavailableProducts = [];

    let totalAmount = 0;

    for (const item of cart.products) {

      const product = await this.productsRepository.getById(
        item.product
      );

      if (!product) {

        unavailableProducts.push({
          product: item.product,
          quantity: item.quantity
        });

        continue;
      }

      const updatedProduct =
        await this.productsRepository.decreaseStock(
          product._id,
          item.quantity
        );

      if (!updatedProduct) {

        unavailableProducts.push({
          product: product._id,
          title: product.title,
          quantity: item.quantity,
          availableStock: product.stock
        });

        continue;
      }

      const subtotal =
        product.price * item.quantity;

      totalAmount += subtotal;

      purchasedProducts.push({
        product: product._id,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
    }

    if (purchasedProducts.length === 0) {

      return {
        ticket: null,
        purchasedProducts: [],
        unavailableProducts
      };
    }

    const purchasedIds =
      purchasedProducts.map(function (item) {
        return item.product.toString();
      });

    const remainingProducts =
      cart.products.filter(function (item) {

        return !purchasedIds.includes(
          item.product.toString()
        );

      });

    await this.cartsRepository.update(
      cartId,
      {
        products: remainingProducts
      }
    );

    const ticket =
      await this.ticketsService.create(
        totalAmount,
        user.email
      );

    return {
      ticket,
      purchasedProducts,
      unavailableProducts
    };
  }

}

export default PurchaseService;