import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import passport from "passport";
import passwordRouter from "./routes/password.router.js";
import connectDB from "./config/db.js";
import initializePassport from "./config/passport.config.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

await connectDB();

initializePassport();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set(
  "views",
  path.join(__dirname, "views")
);

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/password", passwordRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log("Cliente conectado");
});

httpServer.listen(
  process.env.PORT || 8080,
  () => {
    console.log(
      `Servidor corriendo en puerto ${
        process.env.PORT || 8080
      }`
    );
  }
);