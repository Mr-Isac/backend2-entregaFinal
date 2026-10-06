import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersService from "../services/users.service.js";

const router = Router();

const usersService = new UsersService();

router.post("/register", async function (req, res) {
  try {

    const user = await usersService.register(req.body);

    res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
      }
    });

  } catch (error) {

    res.status(400).json({
      status: "error",
      message: error.message
    });

  }
});

router.post("/login", async function (req, res) {
  try {

    const { email, password } = req.body;

    const user = await usersService.getByEmail(email);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email o contraseña incorrectos"
      });
    }

    const passwordValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        status: "error",
        message: "Email o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      status: "success",
      message: "Login exitoso",
      token
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: "Error al iniciar sesión"
    });

  }
});

export default router;