import { Request, Response } from "express";
import { LocalJSONdb } from "./product.db";
import { z } from "zod";
import { Product, ProductWithId } from "./product.zod";

export function getAllProducts(req: Request, res: Response) {
  try {
    const db = LocalJSONdb.getInstance();
    const data = db.find();
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}

export function getProductById(req: Request, res: Response) {
  try {
    const validation = z.object({ id: z.string() }).safeParse(req.params);
    if (!validation.success) {
      return res.status(422).send({ message: validation.error.issues });
    }
    const { id } = validation.data;
    const db = LocalJSONdb.getInstance();
    const data = db.findById(Number(id));
    if (!data)
      return res.status(404).send({ message: "Объект с данным id не найден" });
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}

export function postProduct(req: Request, res: Response) {
  try {
    const validation = Product.safeParse(req.body);
    if (!validation.success) {
      return res.status(422).send({ message: validation.error.issues });
    }

    const data = validation.data;
    console.log(data);

    const db = LocalJSONdb.getInstance();

    const newProduct = db.create(data);
    res.status(201).send(newProduct);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}

// BUG: удаляются объекты после редактирования другого объекта
export function putProduct(req: Request, res: Response) {
  try {
    const validation = ProductWithId.safeParse(req.body);
    if (!validation.success) {
      console.log(validation.error.issues);

      return res.status(422).send({ message: validation.error.issues });
    }
    const data = validation.data;

    const db = LocalJSONdb.getInstance();
    const updatedProduct = db.findByIdAndUpdate(data);

    res.send(updatedProduct);
  } catch (error) {}
}

export function deleteProduct(req: Request, res: Response) {
  try {
    const validation = z.object({ id: z.string() }).safeParse(req.body);
    if (!validation.success) {
      return res.status(422).send({ message: validation.error.issues });
    }
    const { id } = validation.data;
    const db = LocalJSONdb.getInstance();
    const data = db.findbyIdAndDelete(Number(id));
    if (!data)
      return res.status(404).send({ message: "Объект для удаления не найден" });
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}
