import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Forzar el uso de IPv4 primero
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;