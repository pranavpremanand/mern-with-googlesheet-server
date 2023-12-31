import express from "express";
const app = express();
import cors from "cors";
import "dotenv/config";
import userRoute from "./routes/userRoute.js";
import mongoose from "mongoose";

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);
mongoose.connection
  .on("connected", () => console.log("Database connected successfully"))
  .on("error", (err) => console.log("Database connection failed!", err));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

app.use("/api", userRoute);