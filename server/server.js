import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

try {
  console.log("Connecting to MongoDB...");
  console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
  console.log(
    process.env.MONGO_URI?.replace(/\/\/.*:.*@/, "//***:***@")
  );
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB Connected");

  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
  });

} catch (err) {
  console.error("MongoDB connection failed:");
  console.error(err);
}

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);

