import { Router } from "express";
import passport from "passport";
import CartsService from "../services/carts.service.js";
import PurchaseService from "../services/purchase.service.js";
import { authorization } from "../middlewares/auth.middleware.js";

const router = Router();

const cartsService = new CartsService();
const purchaseService = new PurchaseService();


// Crear carrito
router.post("/", async function (req, res) {

  try {

    const cart = await cartsService.create();

    res.status(201).json(cart);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// Obtener carrito
router.get("/:cid", async function (req, res) {

  try {

    const cart =
      await cartsService.getByIdWithProducts(
        req.params.cid
      );

    if (!cart) {

      return res.status(404).json({
        error: "Carrito no encontrado"
      });

    }

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// Agregar producto al carrito
router.post(
  "/:cid/product/:pid",

  passport.authenticate(
    "jwt",
    { session: false }
  ),

  authorization(["user"]),

  async function (req, res) {

    try {

      const cart =
        await cartsService.addProduct(
          req.params.cid,
          req.params.pid
        );

      if (!cart) {

        return res.status(404).json({
          error: "Carrito no encontrado"
        });

      }

      res.json(cart);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


// Comprar carrito
router.post(
  "/:cid/purchase",

  passport.authenticate(
    "jwt",
    { session: false }
  ),

  authorization(["user"]),

  async function (req, res) {

    try {

    if (
  req.user.cart._id.toString() !==
  req.params.cid
) {
  return res.status(403).json({
    status: "error",
    message: "No puedes comprar otro carrito"
  });
}

      const result =
        await purchaseService.purchase(
          req.params.cid,
          req.user
        );

      if (
        !result.ticket &&
        result.unavailableProducts.length > 0
      ) {

        return res.status(400).json({
          status: "error",
          message: "No hay stock suficiente para realizar la compra",
          unavailableProducts:
            result.unavailableProducts
        });

      }

      res.json({
        status: "success",
        message: "Compra realizada correctamente",
        ticket: result.ticket,
        purchasedProducts:
          result.purchasedProducts,
        unavailableProducts:
          result.unavailableProducts
      });

    } catch (error) {

      res.status(400).json({
        status: "error",
        message: error.message
      });

    }

  }
);


// Eliminar producto del carrito
router.delete(
  "/:cid/products/:pid",
  async function (req, res) {

    try {

      const cart =
        await cartsService.removeProduct(
          req.params.cid,
          req.params.pid
        );

      if (!cart) {

        return res.status(404).json({
          error: "Carrito no encontrado"
        });

      }

      res.json({
        message: "Producto eliminado del carrito",
        cart
      });

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


// Actualizar productos del carrito
router.put(
  "/:cid",
  async function (req, res) {

    try {

      const cart =
        await cartsService.updateProducts(
          req.params.cid,
          req.body.products
        );

      if (!cart) {

        return res.status(404).json({
          error: "Carrito no encontrado"
        });

      }

      res.json(cart);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


// Actualizar cantidad de producto
router.put(
  "/:cid/products/:pid",
  async function (req, res) {

    try {

      const cart =
        await cartsService.updateProductQuantity(
          req.params.cid,
          req.params.pid,
          req.body.quantity
        );

      if (cart === null) {

        return res.status(404).json({
          error: "Carrito no encontrado"
        });

      }

      if (cart === false) {

        return res.status(404).json({
          error: "Producto no encontrado en carrito"
        });

      }

      res.json(cart);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


// Vaciar carrito
router.delete(
  "/:cid",
  async function (req, res) {

    try {

      const cart =
        await cartsService.clearCart(
          req.params.cid
        );

      if (!cart) {

        return res.status(404).json({
          error: "Carrito no encontrado"
        });

      }

      res.json({
        message: "Carrito vaciado",
        cart
      });

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


export default router;