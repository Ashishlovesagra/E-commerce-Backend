import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./Config/db.js";
import authRoute from "./Routes/authRoute.js";
import productRoute from "./Routes/productRoute.js";
import categoryRoute from "./Routes/categoryRoute.js";
import cors from "cors";

//Configure env
dotenv.config();

//database configure
connectDB();
//Rest Object
const app = express();

//JWT options
// const opts = {};
// opts.jwtFromRequest = cookieExtractor;
// opts.secretOrKey = process.env.JWT_SECRET;

//MiddleWares
app.use(cors({origin: ['http://localhost:5173','https://e-commerce-app-by-ashish.netlify.app']}));
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/products", productRoute);

//Rest API
app.get("/*", (req, res) => {
  res.send("<h1>Welcome To E-commerce App </h1>");
});

//PORT
const Port = process.env.Port || 1009;

//run listen
app.listen(Port, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on Port ${Port}`
  );
});
