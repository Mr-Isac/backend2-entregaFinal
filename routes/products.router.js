import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/auth.middleware.js";
import ProductsService from "../services/products.service.js";

const router = Router();

const productsService = new ProductsService();


// Obtener productos
router.get("/", async function (req, res) {

  try {

    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    const filter = {};

    if (query) {

      filter.$or = [
        { category: query },
        { status: query === "true" }
      ];

    }

    const options = {
      page: Number(page),
      limit: Number(limit)
    };

    if (sort === "asc") {
      options.sort = { price: 1 };
    }

    if (sort === "desc") {
      options.sort = { price: -1 };
    }

    const result = await productsService.getAll(
      filter,
      options
    );

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}`
        : null
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: "Error al obtener productos"
    });

  }

});


// Obtener producto por ID
router.get("/:pid", async function (req, res) {

  try {

    const product = await productsService.getById(
      req.params.pid
    );

    if (!product) {

      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });

    }

    res.json({
      status: "success",
      payload: product
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: "Error al obtener el producto"
    });

  }

});


// Crear producto - solo admin
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization(["admin"]),
  async function (req, res) {

    try {

      const product = await productsService.create(
        req.body
      );

      const io = req.app.get("io");

      if (io) {
        io.emit("updateProducts");
      }

      res.status(201).json({
        status: "success",
        payload: product
      });

    } catch (error) {

      res.status(400).json({
        status: "error",
        message: error.message
      });

    }

  }
);


// Actualizar producto - solo admin
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["admin"]),
  async function (req, res) {

    try {

      const product = await productsService.update(
        req.params.pid,
        req.body
      );

      if (!product) {

        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado"
        });

      }

      const io = req.app.get("io");

      if (io) {
        io.emit("updateProducts");
      }

      res.json({
        status: "success",
        payload: product
      });

    } catch (error) {

      res.status(400).json({
        status: "error",
        message: error.message
      });

    }

  }
);


// Eliminar producto - solo admin
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["admin"]),
  async function (req, res) {

    try {

      const product = await productsService.delete(
        req.params.pid
      );

      if (!product) {

        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado"
        });

      }

      const io = req.app.get("io");

      if (io) {
        io.emit("updateProducts");
      }

      res.json({
        status: "success",
        message: "Producto eliminado correctamente"
      });

    } catch (error) {

      res.status(500).json({
        status: "error",
        message: "Error al eliminar el producto"
      });

    }

  }
);


export default router;