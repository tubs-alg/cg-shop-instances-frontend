<script setup>

</script>

<template>
  <div class="d-flex flex-column h-100">
    <router-link :to="link" class="text-decoration-none text-base">
      <h2 class="text-h5 mb-4 d-flex">
        <span>{{ title }}</span>
        <v-icon size="32" class="ms-2">mdi-chevron-right</v-icon>
      </h2>
    </router-link>
    <div>
      {{ description }}
    </div>

    <v-spacer></v-spacer>

    <div class="text-center mt-10">
      <router-link :to="link" class="text-decoration-none text-base">
        <v-btn size="small" variant="outlined">Learn more</v-btn>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProblemCard',
  props: {
    title: String,
    description: String,
    link: String
  }
}
</script>

<style scoped>

</style>