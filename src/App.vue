<script setup>
import {computed} from 'vue'
import {useRouter} from "vue-router";
import Problems from "@/data/problems";

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
          CG:SHOP Instances Collection
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu
          open-on-hover
      >
        <template v-slot:activator="{ props }">
          <v-btn
              :color="transparentAppBar?'white' : 'black'"
              v-bind="props"
          >
            <v-icon class="me-2">mdi-search-web</v-icon>
            Problems
          </v-btn>
        </template>

        <v-list>
          <v-list-item
              v-for="key in Object.keys(Problems)"
              :key="key"
          >
            <router-link :to="{
              name: 'instances',
              params: {
                problem: Problems[key].id
              }
            }" class="text-decoration-none text-black">
            <v-list-item-title>{{ Problems[key].name }}</v-list-item-title>
            </router-link>
          </v-list-item>
        </v-list>
      </v-menu>

      <router-link to="/favorites" class="text-decoration-none me-3">
        <v-btn icon :color="transparentAppBar?'white' : 'black'">
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </router-link>

    </v-app-bar>

    <v-main>
      <router-view/>

      <v-footer class="d-flex justify-space-between" color="grey" v-if="showFooter">
        <span>&copy; 2021 CG:SHOP Instances Collection</span>
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
