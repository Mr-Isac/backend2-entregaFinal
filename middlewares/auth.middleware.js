export const authorization = function (roles) {

  return function (req, res, next) {

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para realizar esta acción"
      });
    }

    next();
  };
};