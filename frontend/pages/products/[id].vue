<template>
  <div>
    <ProductDetails v-if="data" :product="data" />
  </div>
</template>

<script setup lang="ts">
import { ProductWithId } from "~/types/product.zod";

const { id } = useRoute().params;
const url = "http://109.167.145.3/api/product/" + id;

const { data } = await useFetch<ProductWithId>(url);
</script>

<style scoped></style>
