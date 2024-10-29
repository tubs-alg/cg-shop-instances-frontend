<template>
  <v-row class="mb-4" align="center" justify="center">
    <v-col md="3" cols="12" class="text-center">
      <router-link :to="searchUrl" class="me-4">
        <v-btn>
          <v-icon>mdi-chevron-left</v-icon>
          Search Instances
        </v-btn>
      </router-link>
    </v-col>
    <v-col md="9" cols="12" class="text-center text-md-start">
      <h1 class="text-h3">{{ name }}</h1>
    </v-col>
  </v-row>
</template>

<script>
import Problems from "@/data/problems";

export default {
  props: {
    problem: Problems
  },
  data() {
    return {
      searchUrl: {
        name: 'instances',
        params: {
          problem: this.problem.id
        }
      },
      name: this.problem.name
    }
  }
}
</script>