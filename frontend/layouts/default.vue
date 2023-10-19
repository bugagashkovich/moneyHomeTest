<template>
  <div>
    <header
      class="flex justify-between bg-blue-400 py-6 px-12 m-4 rounded-md shadow-md"
    >
      <ul class="flex gap-12">
        <li class="px-6 py-2 bg-white rounded-md shadow-md">
          <NuxtLink to="/frontend">Products</NuxtLink>
        </li>
        <li class="px-6 py-2 bg-white rounded-md shadow-md">
          <NuxtLink to="/frontend/products/addProduct">Add product</NuxtLink>
        </li>
      </ul>
      <a
        class="my-auto text-white"
        target="_blank"
        href="https://hh.ru/resume/8b8510aaff09eef2240039ed1f454647557559"
        >PRODUCT TESTING Glushikhin A.S.</a
      >
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style scoped>
.router-link-exact-active {
  color: #60a5fa;
  font-weight: 500;
}
</style>
