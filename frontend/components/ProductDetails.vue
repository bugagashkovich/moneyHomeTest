<template>
  <div class="container mx-auto my-6 flex justify-center gap-5">
    <div class="flex flex-col gap-8 w-1/3">
      <div class="flex flex-col gap-2">
        <p class="text-3xl font-semibold">Product info</p>
        <p>Title: {{ mock.title }}</p>
        <p>Brand: {{ mock.brand }}</p>
        <p>Rating: {{ mock.rating }}</p>
        <p>Description: {{ mock.description }}</p>
        <p>Price: {{ mock.price }}</p>
        <p>Discrount: {{ mock.discountPercentage }}</p>
        <p>Category: {{ mock.category }}</p>
        <p>In stock: {{ mock.stock }}</p>
        <p>{{ title }}</p>
      </div>

      <hr />

      <form
        action=""
        class="flex flex-col gap-2"
        @submit.prevent="() => updateProduct"
      >
        <p class="text-3xl font-semibold">Update product</p>
        <label>Title:</label>
        <input
          class="border-2 rounded-md px-4 py-2"
          type="text"
          v-model="title"
        />
        <label>Description:</label>
        <input
          class="border-2 rounded-md px-4 py-2"
          type="text"
          v-model="description"
        />
        <label>Price:</label>
        <input
          class="border-2 rounded-md px-4 py-2"
          type="text"
          v-model="price"
        />
        <label>Rating:</label>
        <input
          class="border-2 rounded-md px-4 py-2"
          type="text"
          v-model="rating"
        />
        <label>Stock:</label>
        <input
          class="border-2 rounded-md px-4 py-2"
          type="text"
          v-model="stock"
        />
        <label>Brand:</label>
        <input
          class="border-2 rounded-md px-4 py-2"
          type="text"
          v-model="brand"
        />
        <label>Category:</label>
        <input
          class="border-2 rounded-md px-4 py-2"
          type="text"
          v-model="category"
        />
        <button
          type="submit"
          class="mx-6 py-2 bg-green-500 text-white rounded-md shadow-dm font-bold"
          v-on:click="updateProduct(mock)"
        >
          UPDATE PRODUCT
        </button>
        <p>{{ errorView }}</p>
      </form>
      <hr />
      <button
        v-on:click="deleteProduct(product.id)"
        class="mx-6 py-2 bg-red-500 text-white rounded-md shadow-dm font-bold"
      >
        DELETE PRODUCT
      </button>
    </div>
    <div class="h-1/2">
      <img
        :src="product.images[i]"
        alt="thubnail"
        class="object-cover h-2/3 rounded-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductWithId } from "~/types/product.zod";
let { product } = defineProps<{ product: ProductWithId }>();
let i = ref<number>(0);
let currentPicture = ref(product.images[i.value]);

let mock = ref<ProductWithId>(product);

let interval = setInterval(() => {
  i.value += 1;
  if (i.value === product.images.length - 1) i.value = 0;

  currentPicture.value = product.images[i.value];
}, 5000);

async function deleteProduct(id: number) {
  try {
    let res = useFetch<ProductWithId>("http://109.167.145.3/api/product", {
      method: "DELETE",
      body: { id: id.toString() },
    });

    if (res.status.value === "error") throw new Error(JSON.stringify(res.data));

    await navigateTo("/frontend");
  } catch (error) {
    console.log(error);
  }
}

let { title, description, price, rating, stock, brand, category } = product;

let errorView = ref<string>("");

// TODO: Прямое изменение product ведет к ошибке. До решения пользуюсь mock
async function updateProduct(newProduct: ProductWithId) {
  try {
    let { data, pending, error, refresh } = await useFetch<ProductWithId>(
      "http://109.167.145.3/api/product",
      {
        method: "PUT",
        body: {
          ...newProduct,
          title,
          description,
          price: Number(price),
          rating: Number(rating),
          stock: Number(stock),
          brand,
          category,
        },
      }
    );

    if (error.value) {
      console.log(error.value);
      throw new Error(JSON.stringify(error.value?.cause));
    }

    if (data.value) {
      console.log("UUPDATE");
      mock.value = data.value;
      console.log(mock.value);
    }
  } catch (error) {
    console.log("catched");
    console.log(error);

    if (error instanceof Error) errorView.value = error.message;
  }
}

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped></style>
