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

  //   TODO: Сделать клонирование бд в файл
  findByIdAndUpdate(data: ProductWithId): ProductWithId | undefined {
    if (!LocalJSONdb.isConnected)
      throw new Error("Требуется подключение к базе данных");

    let dataToUpdate = LocalJSONdb.data.find((product) => {
      return (product.id = data.id);
    });
    if (!dataToUpdate) throw new Error("Объект для обновления не найден");
    dataToUpdate = data;
    let newState = [
      ...LocalJSONdb.data.filter((product) => {
        return product.id != data.id;
      }),
      dataToUpdate,
    ];
    LocalJSONdb.data = newState;
    return dataToUpdate;
  }

  //   TODO: Сделать клонирование бд в файл
  findbyIdAndDelete(id: number): ProductWithId | undefined {
    if (!LocalJSONdb.isConnected)
      throw new Error("Требуется подключение к базе данных");

    let foo = LocalJSONdb.data.find((product) => {
      return product.id === id;
    });
    let newState = LocalJSONdb.data.filter((product) => {
      return product.id != id;
    });
    LocalJSONdb.data = newState;
    LocalJSONdb.total = LocalJSONdb.data.length;
    return foo;
  }

  //   TODO: Сделать клонирование бд в файл
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
    return newProduct;
  }

  static async write(): Promise<void> {}
}
