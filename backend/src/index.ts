import { LocalJSONdb } from "./product/product.db";

let db = LocalJSONdb.getInstance();
db.connect("src/product/product.data.test.json");
