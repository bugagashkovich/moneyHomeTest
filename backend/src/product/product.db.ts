import { Product, ProductDB, ProductWithId } from "./product.zod";
import fs from "fs";

export class LocalJSONdb {
  private static instance: LocalJSONdb;
  private static data: ProductDB["products"];
  private static total: ProductDB["total"];
  private static skip: ProductDB["skip"]; // TODO: Зачем это нужно?
  private static limit: ProductDB["limit"];
  private static lastId: number;
  private static isConnected: boolean = false;
  private static connectionURL: string;

  private constructor() {}

  static getInstance(): LocalJSONdb {
    if (!LocalJSONdb.instance) {
      LocalJSONdb.instance = new LocalJSONdb();
    }
    return LocalJSONdb.instance;
  }

  connect(path: string) {
    let data = fs.readFileSync(path, "utf-8");
    const { products, total, skip, limit } = JSON.parse(data) as ProductDB;
    LocalJSONdb.data = products;
    LocalJSONdb.total = total;
    LocalJSONdb.skip = skip;
    LocalJSONdb.limit = limit;

    LocalJSONdb.isConnected = true;
    LocalJSONdb.connectionURL = path;
    LocalJSONdb.lastId = Math.max(...products.map((o) => o.id));
  }

  find(): ProductWithId[] {
    if (!LocalJSONdb.isConnected)
      throw new Error("Требуется подключение к базе данных");

    return LocalJSONdb.data;
  }

  findById(id: number): Product | undefined {
    if (!LocalJSONdb.isConnected)
      throw new Error("Требуется подключение к базе данных");

    return LocalJSONdb.data.find((product) => {
      return product.id === id;
    });
  }

  findByIdAndUpdate(data: ProductWithId): ProductWithId | undefined {
    if (!LocalJSONdb.isConnected)
      throw new Error("Требуется подключение к базе данных");

    let dataToUpdate = LocalJSONdb.data.find((product) => {
      return (product.id = data.id);
    });
    if (!dataToUpdate) throw new Error("Объект для обновления не найден");

    dataToUpdate = data;

    // Можно было бы и иммутабельно это сделать, но тогда меняется порядок карточек.
    // и получалась какая-то странная ошибка с уменьшением количества объектов.

    let index = LocalJSONdb.data.findIndex((product) => {
      return (product.id = data.id);
    });
    LocalJSONdb.data[index] = data;
    this.write();
    return dataToUpdate;
  }

  findbyIdAndDelete(id: number): ProductWithId | undefined {
    if (!LocalJSONdb.isConnected)
      throw new Error("Требуется подключение к базе данных");

    let foo = LocalJSONdb.data.find((product) => {
      return product.id === id;
    });

    if (!foo) return foo;

    let newState = LocalJSONdb.data.filter((product) => {
      return product.id != id;
    });
    LocalJSONdb.data = newState;
    LocalJSONdb.total = LocalJSONdb.data.length;
    this.write();
    return foo;
  }

  create(data: Product): ProductWithId {
    if (!LocalJSONdb.isConnected)
      throw new Error("Требуется подключение к базе данных");

    if (LocalJSONdb.total === LocalJSONdb.limit)
      throw new Error(
        "Ошибка создания нового продукта! Превышен лимит объектов в базе данных!"
      );
    LocalJSONdb.lastId += 1;
    const newProduct: ProductWithId = { ...data, id: LocalJSONdb.lastId };
    LocalJSONdb.data = [...LocalJSONdb.data, newProduct];
    LocalJSONdb.total = LocalJSONdb.data.length;
    this.write();
    return newProduct;
  }

  write(): void {
    fs.writeFileSync(
      LocalJSONdb.connectionURL,
      JSON.stringify({
        products: LocalJSONdb.data,
        total: LocalJSONdb.total,
        skip: LocalJSONdb.skip,
        limit: LocalJSONdb.limit,
      })
    );
  }
}
