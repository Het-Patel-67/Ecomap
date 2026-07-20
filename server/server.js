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

await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);

