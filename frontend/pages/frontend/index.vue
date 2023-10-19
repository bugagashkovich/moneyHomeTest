<template>
  <div class="container mx-auto mt-4">
    <h1 class="text-bold text-3xl mx-auto my-16 flex justify-center">
      PRODUCTS {{ title }}
    </h1>
    <form class="mb-4 grid grid-cols-4 gap-2" @submit.prevent="() => sort">
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
      /><button
        type="submit"
        class="mx-6 py-2 px-6 bg-green-500 text-white rounded-md shadow-dm font-bold center"
        v-on:click="sort"
      >
        SORT PRODUCTS
      </button>
      <button
        class="mx-6 py-2 px-6 bg-blue-500 text-white rounded-md shadow-dm font-bold center"
        v-on:click="clear"
      >
        CLEAR FIELDS
      </button>
    </form>
    <div class="grid grid-cols-5 gap-5">
      <div v-for="p in viewData">
        <ProductCard :product="p" />
      </div>
    </div>
    <div class="flex gap-4 m-12 justify-center">
      <div v-for="(c, i) in chunkData" :key="i">
        <button
          v-on:click="
            if (chunkData) {
              viewData = chunkData[i];
              currentChunk = i;
            }
          "
          :class="[
            currentChunk === i
              ? 'h-4 w-4 bg-[#60a5fa] rounded-sm shadow-sm'
              : 'h-4 w-4 bg-green-200 rounded-sm shadow-sm',
          ]"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductWithId } from "~/types/product.zod";
import { matchSorter } from "match-sorter";

const { data: products } = await useFetch<ProductWithId[]>(
  "http://109.167.145.3/api/product"
);

let dataSortred = ref(products.value);

let currentChunk = 0;
const chunkSize = 10;
let viewData = ref<ProductWithId[]>([]);

let chunkData = generateChunks();

// TODO: Уверен, что неправильно, но иначе почему-то не работает

let title = ref("");
let description = ref("");
let price = ref("");
let rating = ref("");
let stock = ref("");
let brand = ref("");
let category = ref("");

function generateChunks() {
  const chunkData = dataSortred.value?.reduce(
    (resultArray: Array<ProductWithId[]>, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    },
    []
  );

  if (chunkData) viewData.value = chunkData[currentChunk];
  return chunkData;
}

// TODO: Рефактор, сделано на быструю руку
function sort() {
  if (!products.value) return;
  dataSortred.value = products.value;
  currentChunk = 0;
  dataSortred.value = title.value.length
    ? matchSorter(dataSortred.value, title.value, {
        keys: ["title"],
      })
    : dataSortred.value;
  dataSortred.value = description.value.length
    ? matchSorter(dataSortred.value, description.value, {
        keys: ["description"],
      })
    : dataSortred.value;
  dataSortred.value = price.value.length
    ? matchSorter(dataSortred.value, price.value, {
        keys: ["price"],
      })
    : dataSortred.value;
  dataSortred.value = rating.value.length
    ? matchSorter(dataSortred.value, rating.value, {
        keys: ["rating"],
      })
    : dataSortred.value;
  dataSortred.value = stock.value.length
    ? matchSorter(dataSortred.value, stock.value, {
        keys: ["stock"],
      })
    : dataSortred.value;
  dataSortred.value = brand.value.length
    ? matchSorter(dataSortred.value, brand.value, {
        keys: ["brand"],
      })
    : dataSortred.value;
  dataSortred.value = category.value.length
    ? matchSorter(dataSortred.value, category.value, {
        keys: ["category"],
      })
    : dataSortred.value;

  chunkData = generateChunks();
}
function clear() {
  if (!products.value) return;
  dataSortred.value = products.value;
  currentChunk = 0;
  chunkData = generateChunks();
  console.log("clear");
  dataSortred.value = products.value;
  title.value = "";
  description.value = "";
  price.value = "";
  rating.value = "";
  stock.value = "";
  brand.value = "";
  category.value = "";
}
</script>

<style scoped></style>
