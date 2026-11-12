<script setup>
import connectionsImg from "@/assets/connections.png";
import dfgLogoEnglischBlauEnImg from "@/assets/dfg_logo_englisch_blau_en.jpg";
import {computed, ref} from 'vue'
import {useRoute} from "vue-router";
import {problemList} from "@/data/problems";

const route = useRoute();
const drawer = ref(false);

// Pages with a dark hero section let the app bar float transparently on top of it.
const transparentAppBar = computed(() => route.name === "home" || route.name === "instances");

// Text color of the app bar items; white on top of the dark hero sections.
const navColor = computed(() => transparentAppBar.value ? 'white' : undefined);

const showFooter = computed(() => route.name !== "instances");

const apiUrl = import.meta.env.VITE_API_URL + 'docs'
const competitionsUrl = 'https://cgshop.ibr.cs.tu-bs.de/'
const year = new Date().getFullYear()

const navGroups = [
  {
    title: 'Instances & Solutions',
    icon: 'mdi-database-search-outline',
    link: (p) => ({name: 'instances', params: {problem: p.id}})
  },
  {
    title: 'Problem Definitions',
    icon: 'mdi-book-open-variant-outline',
    link: (p) => '/' + p.id
  },
]
</script>

<template>
  <v-app>
    <v-app-bar :color="transparentAppBar ? 'transparent' : 'surface'"
               :absolute="transparentAppBar"
               :class="{'app-bar--solid': !transparentAppBar}"
               :theme="transparentAppBar ? 'dark' : undefined"
               flat>
      <router-link to="/" class="brand d-flex align-center ms-4 text-decoration-none"
                   :class="{'text-white': transparentAppBar}">
        <img :src="connectionsImg" alt="" width="30" height="30">
        <span class="ms-3 font-weight-bold">CG:SHOP</span>
        <span class="ms-1 font-weight-light hidden-xs">Instances</span>
      </router-link>

      <v-spacer></v-spacer>

      <div class="hidden-sm-and-down d-flex align-center me-2">
        <v-menu v-for="group in navGroups" :key="group.title" open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :prepend-icon="group.icon" append-icon="mdi-chevron-down" variant="text"
                   :color="navColor">
              {{ group.title }}
            </v-btn>
          </template>

          <v-list density="compact" min-width="300" nav>
            <v-list-item v-for="problem in problemList"
                         :key="problem.id"
                         :to="group.link(problem)"
                         :title="problem.name"
                         :subtitle="'CG:SHOP ' + problem.year">
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn :href="apiUrl" target="_blank" prepend-icon="mdi-api" variant="text" :color="navColor">API</v-btn>
        <v-btn :href="competitionsUrl" prepend-icon="mdi-trophy-outline" variant="text"
               :color="navColor">Competitions</v-btn>
      </div>

      <v-app-bar-nav-icon class="hidden-md-and-up" :color="navColor" @click="drawer = !drawer" aria-label="Open navigation"/>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="end" temporary>
      <v-list nav density="compact">
        <template v-for="group in navGroups" :key="group.title">
          <v-list-subheader>
            <v-icon :icon="group.icon" size="small" class="me-1"></v-icon>
            {{ group.title }}
          </v-list-subheader>
          <v-list-item v-for="problem in problemList"
                       :key="problem.id"
                       :to="group.link(problem)"
                       :title="problem.name"
                       @click="drawer = false">
          </v-list-item>
          <v-divider class="my-2"></v-divider>
        </template>
        <v-list-item :href="apiUrl" target="_blank" prepend-icon="mdi-api" title="API documentation"></v-list-item>
        <v-list-item :href="competitionsUrl" prepend-icon="mdi-trophy-outline" title="Competitions"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <!-- The instance search is kept alive, so results, filters and scroll position survive visiting an instance. -->
      <router-view v-slot="{ Component, route: viewRoute }">
        <keep-alive include="InstancesView" :max="3">
          <component :is="Component" :key="viewRoute.fullPath"/>
        </keep-alive>
      </router-view>
    </v-main>

    <v-footer v-if="showFooter" class="site-footer d-block pt-10 pb-6" color="brand-dark">
      <v-container>
        <v-row>
          <v-col cols="12" md="5">
            <div class="d-flex align-center mb-3">
              <img :src="connectionsImg" alt="" width="28" height="28">
              <span class="ms-3 text-title-large font-weight-bold">CG:SHOP Instances</span>
            </div>
            <p class="footer-text">
              Benchmark instances and solutions of the Computational Geometry Challenges (CG:SHOP),
              maintained by the Algorithms Division of TU Braunschweig, Germany.
            </p>
          </v-col>

          <v-col cols="6" md="3">
            <div class="footer-heading">Explore</div>
            <router-link v-for="problem in problemList" :key="problem.id" :to="'/' + problem.id"
                         class="footer-link">
              {{ problem.name }}
            </router-link>
          </v-col>

          <v-col cols="6" md="2">
            <div class="footer-heading">Resources</div>
            <a :href="competitionsUrl" class="footer-link">Competitions</a>
            <a :href="apiUrl" target="_blank" class="footer-link">API documentation</a>
            <a href="https://gitlab.ibr.cs.tu-bs.de/hip/hip-generators" class="footer-link">Instance generators</a>
            <a href="mailto:cgshop-admin@ibr.cs.tu-bs.de" class="footer-link">Contact</a>
            <a href="https://cgshop.ibr.cs.tu-bs.de/legal/" class="footer-link">Legal notice</a>
          </v-col>

          <v-col cols="12" md="2">
            <div class="footer-heading">Supported by</div>
            <a href="https://www.dfg.de/" class="dfg-logo d-inline-block">
              <img :src="dfgLogoEnglischBlauEnImg" alt="Deutsche Forschungsgemeinschaft (DFG)">
            </a>
          </v-col>
        </v-row>

        <v-divider class="my-6" opacity="0.2"></v-divider>

        <div class="footer-small d-flex flex-wrap justify-space-between ga-2">
          <span>© {{ year }} Algorithms Division, TU Braunschweig.
            We do not take any legal responsibility for any harm resulting from usage of this site.</span>
          <span>Vector graphics by <a href="https://de.freepik.com/" class="footer-inline-link">Freepik</a>.</span>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.brand {
  color: rgb(var(--v-theme-on-surface));
  font-size: 1.15rem;
  letter-spacing: 0.01em;
}

.app-bar--solid {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.site-footer {
  color: rgba(255, 255, 255, 0.85);
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  max-width: 42ch;
  line-height: 1.6;
}

.footer-heading {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.75rem;
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.2rem 0;
}

.footer-link:hover,
.footer-inline-link:hover {
  color: white;
  text-decoration: underline;
}

.footer-inline-link {
  color: inherit;
}

.footer-small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
}

.dfg-logo {
  background: white;
  border-radius: 8px;
  padding: 10px 12px;
}

.dfg-logo img {
  display: block;
  width: 100%;
  max-width: 220px;
}
</style>
