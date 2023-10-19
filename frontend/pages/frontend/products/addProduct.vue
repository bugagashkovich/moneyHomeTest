<template>
  <div class="container mx-auto">
    <form
      class="mb-4 grid grid-cols-4 gap-2 items-center"
      @submit.prevent="() => createProduct"
    >
      <label>Title:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="text"
        v-model="inputProduct.title"
      />
      <label>Description:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="text"
        v-model="inputProduct.description"
      />
      <label>Price:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="number"
        v-model="inputProduct.price"
      />
      <label>Discount:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="number"
        v-model="inputProduct.discountPercentage"
      />
      <label>Rating:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="number"
        v-model="inputProduct.rating"
      />
      <label>Stock:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="number"
        v-model="inputProduct.stock"
      />
      <label>Brand:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="text"
        v-model="inputProduct.brand"
      />
      <label>Category:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="text"
        v-model="inputProduct.category"
      />
      <label>thumbnail:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="text"
        v-model="inputProduct.thumbnail"
      />
      <label>images:</label>
      <input
        class="border-2 rounded-md px-4 py-2"
        type="text"
        v-model="inputProduct.images"
      />
      <button
        type="submit"
        class="mx-6 py-2 px-6 bg-green-500 text-white rounded-md shadow-dm font-bold center"
        v-on:click="createProduct"
      >
        ADD PRODUCT
      </button>
    </form>
    <p>{{ errorView }}</p>
  </div>
</template>

<script setup lang="ts">
import { Product, ProductWithId } from "~/types/product.zod";

let inputProduct = {
  title: "",
  description: " ",
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  brand: "",
  category: "",
  thumbnail: "",
  images: "",
};

let errorView = ref("");

const createProduct = async (): Promise<void> => {
  try {
    errorView.value = "";
    let newProduct: Product = {
      title: inputProduct.title,
      description: inputProduct.description,
      price: inputProduct.price,
      discountPercentage: inputProduct.discountPercentage,
      rating: inputProduct.rating,
      stock: inputProduct.stock,
      brand: inputProduct.brand,
      category: inputProduct.category,
      thumbnail: inputProduct.thumbnail,
      images: inputProduct.images.split(","),
    };

    let res = useFetch<ProductWithId>("http://109.167.145.3/api/product", {
      method: "POST",
      body: { ...newProduct },
    });

    if (res.error.value) {
      console.log(res.error.value);
      throw new Error(JSON.stringify(res.error.value.data.message));
    }

    errorView.value = "Успешно добавлено";

    inputProduct = {
      title: "",
      description: " ",
      price: 0,
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      brand: "",
      category: "",
      thumbnail: "",
      images: "",
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) errorView.value = error.message;
  }
};
</script>

<style lang="scss" scoped></style>
