<template>
  <NuxtLink :to="`/frontend/products/${product.id}`">
    <div
      class="rounded-md shadow-md text-center bg-white h-[30vh] flex flex-col justify-between"
    >
      <img
        :src="currentPicture"
        alt="thubnail"
        class="object-cover h-2/3 border-b-2 rounded-t-md"
      />
      <p class="my-auto mx-4">{{ product.title }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ProductWithId } from "~/types/product.zod";
const { product } = defineProps<{ product: ProductWithId }>();
let i = ref<number>(0);
let currentPicture = ref(product.images[i.value]);
let mock = ref<ProductWithId>(product);
let interval = setInterval(() => {
  i.value += 1;
  if (i.value === product.images.length - 1) i.value = 0;

  currentPicture.value = product.images[i.value];
}, 5000);

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped></style>
