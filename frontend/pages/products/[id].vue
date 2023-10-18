<template>
  <div>
    <p>{{ data?.brand }}</p>
    <p>{{ data?.category }}</p>
  </div>
</template>

<script setup lang="ts">
import { ProductWithId } from "~/types/product.zod";

const { id } = useRoute().params;
const url = "http://109.167.145.3/api/product/" + id;

const { data } = await useFetch<ProductWithId>(url);
</script>

<style lang="scss" scoped></style>
