import express from "express";
import { LocalJSONdb } from "./product/product.db";
import cors from "cors";
import productRotuer from "./product/product.router";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/product", productRotuer);

let db = LocalJSONdb.getInstance();
db.connect("src/product/product.data.test.json");
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
