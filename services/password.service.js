import crypto from "crypto";
import bcrypt from "bcrypt";
import UsersRepository from "../repositories/users.repository.js";
import transporter from "../config/mailer.js";

class PasswordService {

  constructor() {
    this.repository = new UsersRepository();
  }

  async createResetToken(email) {

    const user = await this.repository.getByEmail(email);

    if (!user) {
      return null;
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expires = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await this.repository.update(
      user._id,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      }
    );

    const resetLink =
      `http://localhost:8080/api/password/reset?token=${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>

        <p>
          Has solicitado restablecer tu contraseña.
        </p>

        <p>
          Haz clic en el siguiente botón para continuar:
        </p>

        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Restablecer contraseña
        </a>

        <p>
          Este enlace expirará en 1 hora.
        </p>
      `
    });

    return true;
  }

  async resetPassword(token, newPassword) {

    const user = await this.repository.findByResetToken(
      token
    );

    if (!user) {
      throw new Error("Token de recuperación inválido");
    }

    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new Error("El token de recuperación ha expirado");
    }

    const samePassword = bcrypt.compareSync(
      newPassword,
      user.password
    );

    if (samePassword) {
      throw new Error(
        "La nueva contraseña no puede ser igual a la anterior"
      );
    }

    const hashedPassword = bcrypt.hashSync(
      newPassword,
      10
    );

    await this.repository.update(
      user._id,
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    );

    return true;
  }

}

export default PasswordService;