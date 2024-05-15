<script setup>
import {computed} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter();

const transparentAppBar = computed(() => {
  return router.currentRoute.value.name === "home" || router.currentRoute.value.name === "instances"
});

const showLogo = computed(() => {
  return router.currentRoute.value.name !== "home"
});

const showFooter = computed(() => {
  return router.currentRoute.value.name === "home"
});

</script>

<template>
  <v-layout>
    <v-app-bar :color="transparentAppBar? 'transparent': 'white'" :absolute="transparentAppBar" flat>
      <v-img class="ms-5" :src="require('@/assets/connections.png')" max-width="32" v-if="showLogo"></v-img>
      <v-app-bar-title class="ms-5" v-if="showLogo">
        <router-link to="/" :class="showLogo && transparentAppBar? 'text-white text-decoration-none' : 'text-black text-decoration-none'">
          Benchmark Instances Project
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <router-link to="/instances" class="text-decoration-none ms-3">
        <v-btn icon :color="transparentAppBar?'white' : 'black'">
          <v-icon>mdi-search-web</v-icon>
        </v-btn>
      </router-link>

      <router-link to="/favorites" class="text-decoration-none me-3">
        <v-btn icon :color="transparentAppBar?'white' : 'black'">
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </router-link>

    </v-app-bar>

    <v-main>
      <router-view/>

      <v-footer class="d-flex justify-space-between" color="grey" v-if="showFooter">
        <span>&copy; 2021 Benchmark Instances Project</span>
        <small>Vector graphics made by freepik and pch.vector <a href="https://de.freepik.com/" class="text-decoration-none text-white">Freepik</a></small>
      </v-footer>
    </v-main>

  </v-layout>

</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background: #fefefe;
}

</style>
