import { Router } from "express";
import PasswordService from "../services/password.service.js";

const router = Router();

const passwordService = new PasswordService();


// Mostrar página de recuperación
router.get("/reset", function (req, res) {

  res.render("reset-password", {
    token: req.query.token
  });

});


// Solicitar recuperación de contraseña
router.post("/request", async function (req, res) {

  try {

    const { email } = req.body;

    const token = await passwordService.createResetToken(
      email
    );

    if (!token) {

      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });

    }

    res.json({
      status: "success",
      message: "Correo de recuperación enviado"
    });

  } catch (error) {

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

});


// Restablecer contraseña
router.post("/reset", async function (req, res) {

  try {

    const {
      token,
      newPassword
    } = req.body;

    await passwordService.resetPassword(
      token,
      newPassword
    );

    res.json({
      status: "success",
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {

    res.status(400).json({
      status: "error",
      message: error.message
    });

  }

});


export default router;