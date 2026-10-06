import { Router } from "express";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";

const router = Router();

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {

    const userDTO = new UserDTO(req.user);

    res.json({
      status: "success",
      user: userDTO
    });

  }
);

export default router;