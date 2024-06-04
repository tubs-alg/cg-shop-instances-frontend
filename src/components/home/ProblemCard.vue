<script setup>

</script>

<template>
  <div class="d-flex flex-column h-100">
    <v-card width="150" class="mx-auto mb-5" rounded="circle" elevation="5">
      <v-img v-if="img" :src="img"
             rounded="circle" aspect-ratio="1"
             width="150" cover></v-img>
    </v-card>
    <router-link :to="link" class="text-decoration-none text-base">
      <h2 class="text-h5 mb-4 text-center">
        <span>{{ title }}</span>
      </h2>
    </router-link>

    <div class="text-center">
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
    link: String,
    img: String
  }
}
</script>

<style scoped>

</style>