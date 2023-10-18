import express from "express";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  postProduct,
  putProduct,
} from "./product.controller";

let productRotuer = express.Router();

productRotuer.get("/", getAllProducts);
productRotuer.get("/:id", getProductById);

productRotuer.post("/", postProduct);
productRotuer.put("/", putProduct);
productRotuer.delete("/", deleteProduct);

export default productRotuer;
