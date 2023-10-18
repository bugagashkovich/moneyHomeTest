<template>
  <div class="container mx-auto mt-4">
    <h1 class="text-bold text-3xl mx-auto my-16 flex justify-center">
      PRODUCTS
    </h1>
    <div class="grid grid-cols-5 gap-5">
      <div v-for="p in data">
        <ProductCard :product="p" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductWithId } from "../types/product.zod";
const { data } = await useFetch<ProductWithId[]>(
  "http://109.167.145.3/api/product"
);
</script>

<style scoped></style>
