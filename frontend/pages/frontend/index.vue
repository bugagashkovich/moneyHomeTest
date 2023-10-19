<template>
  <div class="container mx-auto mt-4">
    <h1 class="text-bold text-3xl mx-auto my-16 flex justify-center">
      PRODUCTS
    </h1>
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

let { data: products } = await useFetch<ProductWithId[]>(
  "http://109.167.145.3/api/product"
);

let currentChunk = 0;
const chunkSize = 10;
let viewData = ref<ProductWithId[]>([]);

let chunkData = generateChunks();

function generateChunks() {
  const chunkData = products.value?.reduce(
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

  if (chunkData) viewData = ref(chunkData[currentChunk]);
  return chunkData;
}
</script>

<style scoped></style>
