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
  return router.currentRoute.value.name !== "instances" && router.currentRoute.value.name !== "instance_detail"
});

const apiUrl = process.env.VUE_APP_API_URL + 'docs'

</script>

<template>
  <v-layout>
    <v-app-bar :color="transparentAppBar? 'transparent': 'white'" :absolute="transparentAppBar" flat>
      <v-img class="ms-5" :src="require('@/assets/connections.png')" max-width="32" v-if="showLogo"></v-img>
      <v-app-bar-title class="ms-5" v-if="showLogo">
        <router-link to="/"
                     :class="showLogo && transparentAppBar? 'text-white text-decoration-none' : 'text-black text-decoration-none'">
          CG:SHOP Instances Collection
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn :color="transparentAppBar?'white' : 'black'" href="https://cgshop.ibr.cs.tu-bs.de/">
        <v-icon class="me-1">mdi-seal</v-icon>
        <span class="hidden-sm-and-down">Competitions</span>
      </v-btn>

      <v-menu
          open-on-hover
      >
        <template v-slot:activator="{ props }">
          <v-btn
              :color="transparentAppBar?'white' : 'black'"
              v-bind="props"
          >
            <v-icon class="me-1">mdi-search-web</v-icon>
            <span class="hidden-sm-and-down">Instances & Solutions</span>
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="hidden-md-and-up">
            <v-list-item-title class="text-center font-weight-bold">
              Instances & Solutions
            </v-list-item-title>
          </v-list-item>
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

      <v-menu
          open-on-hover
      >
        <template v-slot:activator="{ props }">
          <v-btn
              :color="transparentAppBar?'white' : 'black'"
              v-bind="props"
          >
            <v-icon class="me-1">mdi-image-text</v-icon>
            <span class="hidden-sm-and-down">Problem Definitions</span>
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="hidden-md-and-up">
            <v-list-item-title class="text-center font-weight-bold">
              Problem Definitions
            </v-list-item-title>
          </v-list-item>
          <v-list-item
              v-for="key in Object.keys(Problems)"
              :key="key"
          >
            <router-link :to="'/' + Problems[key].id" class="text-decoration-none text-black">
              <v-list-item-title>{{ Problems[key].name }}</v-list-item-title>
            </router-link>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn :color="transparentAppBar?'white' : 'black'" :href="apiUrl">
        <v-icon class="me-1">mdi-code-braces-box</v-icon>
        <span class="hidden-sm-and-down">Api</span>
      </v-btn>

    </v-app-bar>

    <v-main>
      <router-view :key="$route.fullPath"/>

      <v-footer class="d-block" v-if="showFooter">

        <v-divider class="py-3"></v-divider>
        <v-row justify="space-between">
          <v-col cols="12" md="6">
            <small>
              This website has been developed by the Algorithms Division of the TU Braunschweig,
              Germany.
              <a class="text-primary text-decoration-none"
                 href="https://cgshop.ibr.cs.tu-bs.de/legal/">Legal</a>
              <br/>
              In case of questions, problems, or suggestions, please contact
              <a href="mailto:cgshop-admin@ibr.cs.tu-bs.de"
                 class="text-primary text-decoration-none">cgshop-admin@ibr.cs.tu-bs.de</a>.
              We do not take any legal responsibility for any harm resulting from usage of this site.

              <p>
                Vector graphics made by freepik, fullvector and pch.vector
                <a href="https://de.freepik.com/" class="text-decoration-none text-white">Freepik</a>
              </p>
            </small>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <div>
              <small>Supported by:</small>
              <v-img :src="require('@/assets/dfg_logo_englisch_blau_en.jpg')" width="400"></v-img>
            </div>
          </v-col>
        </v-row>
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
