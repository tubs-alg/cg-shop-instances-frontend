<template>
  <div class="search-area">
    <div class="gradient">
      <v-container>
        <v-tabs
            v-model="problem"
            align-tabs="center"
        >
          <v-tab :value="prob.identifier"
                 v-for="prob in problems"
                 :key="prob.identifier">
            {{ prob.displayName }}
          </v-tab>
        </v-tabs>

      </v-container>
      <v-skeleton-loader v-if="currentlyUpdatingFilters" :elevation="6" type="card" max-width="800" class="mx-auto"
                         color="transparent"></v-skeleton-loader>
      <v-card v-if="!currentlyUpdatingFilters" elevation="0" max-width="800" class="mx-auto" color="transparent">
        <v-container>
          <v-combobox
              v-model="search"
              v-model:search="search"
              label="Search for instance"
              variant="outlined"
          ></v-combobox>

          <div v-for="(input, idx) in filters" :key="idx">
            <v-checkbox v-if="input.type === 'boolean'"
                        indeterminate
                        v-model="input.value"
                        :label="input.displayName"
                        class="mt-3"></v-checkbox>
            <v-range-slider v-if="input.type === 'int'"
                            :label="input.displayName"
                            class="mt-3"
                            :step="1"
                            v-model="input.value"
                            :max="input.max"
                            :min="input.min"
                            thumb-label="always"
            ></v-range-slider>
            <v-select v-if="input.type === 'choices'" multiple :items="input.choices" v-model="input.value" :label="input.displayName">
            </v-select>
          </div>

          <div class="text-end">
            <router-link :to="'/' + problem" class="text-white">
              <v-btn variant="outlined" append-icon="mdi-open-in-new">Learn more about this problem</v-btn>
            </router-link>
          </div>
        </v-container>
      </v-card>
    </div>
  </div>

  <v-card elevation="0">
    <v-fade-transition>
      <v-btn fab icon="mdi-reload" position="absolute" v-if="showReload"
             :class="currentlyReloading? 'rotate': ''" @click="reload"
             :style="{left: '50%', transform:'translate(-50%, 50%)', 'z-index': 1000}"></v-btn>
    </v-fade-transition>

    <v-container v-if="!currentlyReloading">
      <v-infinite-scroll @load="loadScroll" empty-text="No more instances available" :mode="scrollMode">
        <div class="d-flex flex-wrap">
          <v-col v-for="instance in instances" :key="instance.id">
            <v-slide-x-transition appear>
              <InstanceCard :instance="instance" v-show="true" :problems="problems" :filters="filters"></InstanceCard>
            </v-slide-x-transition>
          </v-col>
        </div>
        <template v-slot:load-more></template>
      </v-infinite-scroll>
    </v-container>
  </v-card>

</template>

<script>
import InstanceCard from "@/components/InstanceCard.vue";
import InstancesService from "@/services/instances.service";

export default {
  name: 'InstancesView',
  components: {
    InstanceCard
  },
  watch: {
    size() {
      this.showReload = true;
    },
    search() {
      this.showReload = true;
    },
    problem() {
      this.updateFilters();
    },
    filters: {
      handler() {
        this.showReload = true;
      },
      deep: true
    }
  },
  data: function () {

    return {
      "filters": [],
      "problems": [],
      "search": "",
      "problem": "jssp",
      "instances": [],
      "page": 1,
      "scrollMode": "intersect",
      "showReload": true,
      "currentlyReloading": true,
      "currentlyUpdatingFilters": true,
    }
  },
  mounted() {
    InstancesService.getProblems().then((response) => {
      this.problems = response.data;
      this.updateFilters();
    });
  },
  methods: {
    updateFilters() {
      this.currentlyUpdatingFilters = true;
      InstancesService.getFilters(this.problem).then((response) => {
        let filters = response.data.filters;
        filters.forEach(function (filter) {
          filter.value = ""
          if (filter.type === "int") {
            filter.value = [filter.min, filter.max]
          } else if (filter.type === "boolean") {
            filter.value = null
          } else if (filter.type === "choices") {
            console.log(filter.choices)
            filter.value = filter.choices;
          }
        })
        this.filters = filters;
        this.currentlyUpdatingFilters = false;

        this.reload();
      })
    },
    requestInstances() {
      let component = this;
      return InstancesService.getInstances(component.problem, component.search, component.filters, this.page);
    },
    reload() {
      let component = this;
      component.scrollMode = "manual"
      component.instances = []
      component.page = 1
      component.currentlyReloading = true

      setTimeout(() => {
        this.requestInstances().then(function (response) {
          component.instances = response.data.results;
          component.scrollMode = "intersect"
          component.showReload = false;
          component.currentlyReloading = false;
          component.page++;
        }).catch(function () {
          component.scrollMode = "intersect"
          component.showReload = false;
          component.currentlyReloading = false;
        });
      }, 300);
    },
    async loadScroll({done}) {
      let component = this;
      component.loading = true;
      this.requestInstances().then(function (response) {
        component.instances.push(...response.data.results);
        component.page++;
        if (response.data.length > 0) {
          done('ok');
        } else {
          done('empty');
        }
      }).catch(function () {
        done('empty');
      });

    },
  }
}
</script>

<style scoped>
@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}

.rotate :deep(.v-btn__content) {
  animation: rotate 1s linear infinite;
}

.search-area {
  margin-top: -64px;
  background-color: #482c50;
  color: white;

}

.search-area .gradient {
  background-size: cover !important;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.65) 100%), no-repeat center center scroll;
  padding-top: 64px;
  padding-bottom: 64px;
}
</style>
