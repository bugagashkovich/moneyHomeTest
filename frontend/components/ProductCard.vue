<template>
  <NuxtLink :to="`/products/${product.id}`">
    <div
      class="rounded-md shadow-md text-center bg-white h-[30vh] flex flex-col justify-between"
    >
      <img
        :src="product.thumbnail"
        alt="thubnail"
        class="object-cover h-2/3 border-b-2 rounded-t-md"
      />
      <p class="my-auto mx-4">{{ product.title }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ProductWithId } from "~/types/product.zod";
const { product } = defineProps({ product: ProductWithId });
</script>

<style scoped></style>
