<script setup>
import Problems from "@/data/problems";
import RangeSliderFilters from "@/components/instances/filters/RangeSliderFilter.vue";
</script>
<template>
  <div class="search-area">
    <div class="gradient">
      <v-skeleton-loader v-if="currentlyUpdatingFilters" :elevation="6" type="card" max-width="800" class="mx-auto"
                         color="transparent"></v-skeleton-loader>
      <v-card v-if="!currentlyUpdatingFilters" elevation="0" max-width="800" class="mx-auto" color="transparent">
        <v-container>

          <h1 class="text-h5 font-weight-light mb-5 d-flex align-center justify-space-between">
            <span>
              {{ problemName }} Instances
            </span>
            <router-link :to="'/' + problem" class="text-white">
              <v-btn variant="outlined" size="small">Learn more</v-btn>
            </router-link>

          </h1>

          <v-combobox
              v-model="search"
              v-model:search="search"
              label="Search for instance"
              variant="outlined"
          ></v-combobox>

          <RangeSliderFilters :fields="problemData['instance_range_query_fields']"
                              ref="filterComponent"
                              @change="filtersChanged"/>

          <v-expand-transition>
            <div class="text-end" v-if="showReload">
              <v-btn fab @click="reload" prepend-icon="mdi-reload">Refresh</v-btn>
            </div>
          </v-expand-transition>

        </v-container>
      </v-card>
    </div>

  </div>

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" height="100px" width="100%" >
    <path fill="#2e506c" fill-opacity="1" d="M0,192L48,197.3C96,203,192,213,288,186.7C384,160,480,96,576,101.3C672,107,768,181,864,208C960,235,1056,213,1152,202.7C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>

  </svg>

  <v-container class="d-flex justify-space-between align-center">
    <span class="text-grey">{{ n }} instances found</span>
    <v-select
        single-line
        max-width="180"
        density="compact"
        v-model="sort"
        :items="sortOptions"
        label="Sort by"
        class="me-5 sort-select"
        rounded="rounded-xl"
    >
      <template #selection="{ props, item }">
        <v-list-item v-bind="props" density="compact">
          <template v-slot:title>
            <v-list-item-title>
              <v-icon :icon="sortOptionIcon(item)" size="x-small"></v-icon>
              {{ sortOptionTitle(item) }}
            </v-list-item-title>
          </template>
        </v-list-item>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" density="compact">
          <template v-slot:title>
            <v-list-item-title>
              <v-icon :icon="sortOptionIcon(item)" size="x-small"></v-icon>
              {{ sortOptionTitle(item) }}
            </v-list-item-title>
          </template>
        </v-list-item>
      </template>

    </v-select>
  </v-container>

  <v-card elevation="0">
    <v-fade-transition>
      <v-btn fab icon="mdi-reload" position="absolute"
             v-if="currentlyReloading"
             class="rotate"
             :style="{left: '50%', transform:'translate(-50%, 50%)', 'z-index': 1000}"></v-btn>
    </v-fade-transition>

    <v-container v-if="!currentlyReloading">
      <v-infinite-scroll @load="loadScroll" empty-text="No more instances available" :mode="scrollMode">
        <div class="d-flex flex-wrap">
          <v-col v-for="instance in instances" :key="instance.id">
            <v-slide-x-transition appear>
              <InstanceCard :instance="instance" v-show="true" :problem="problem"/>
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
    search() {
      this.showReload = true;
    },
    sort() {
      this.reload()
    },
    problem() {
      this.updateFilters();
    }
  },
  computed: {
    service() {
      return new InstancesService(this.problem)
    },
    problemConfig() {
      return Object.values(Problems).find((p) => {
        return p.id === this.problem;
      });
    },
    problemName() {
      if (this.problemConfig) {
        return this.problemConfig.name;
      }

      return "Unknown problem"
    },
    sortOptions() {
      let options = [];

      if (this.problemData === null) {
        return options;
      }

      this.problemData["instance_sort_fields"].forEach((field) => {
        options.push("-" + field);
        options.push(field);
      })

      return options
    }
  },
  data: function () {
    return {
      search: "",
      problem: this.$route.params.problem,
      problemData: null,
      instances: [],
      sort: "uid",
      n: 0,
      limit: 10,
      offset: 0,
      scrollMode: "intersect",
      showReload: false,
      currentlyReloading: true,
      currentlyUpdatingFilters: true,
    }
  },
  mounted() {
    this.updateFilters();
  },
  methods: {
    sortOptionTitle(option) {
      let value = option.value;
      let prefix = ""
      if(value.startsWith('-')) {
        value = value.substring(1);
        prefix = "-"
      }

      if(!this.problemConfig.labels[value]) {
        return option.value;
      }

      return prefix + this.problemConfig.labels[value];
    },
    sortOptionIcon(option) {
      // if option starts with - show an icon
      if (option.value.startsWith('-')) {
        return 'mdi-sort-descending';
      }
      return 'mdi-sort-ascending';
    },
    filtersChanged() {
      this.showReload = true;
    },
    updateFilters() {
      this.currentlyUpdatingFilters = true;
      this.service.getProblem().then((response) => {
        this.problemData = response.data;
        this.currentlyUpdatingFilters = false;

        this.reload();
      })
    },
    getFilterValues() {
      return this.$refs.filterComponent.filter();
    },
    requestInstances(includeCount = false) {
      let component = this;
      return this.service.getInstances(component.search,
          this.getFilterValues(), {
            limit: component.limit,
            offset: component.offset,
            sort: component.sort,
            add_total_count: includeCount
          });
    },
    reload() {
      let component = this;
      component.scrollMode = "manual"
      component.instances = []
      component.offset = 0;
      component.showReload = false;
      component.currentlyReloading = true

      setTimeout(() => {
        this.requestInstances(true).then(function (response) {
          component.n = response.headers["x-total-count"]
          component.instances = response.data
          component.scrollMode = "intersect"
          component.currentlyReloading = false;
          component.offset += response.data.length
        }).catch(function () {
          component.scrollMode = "intersect"
          component.currentlyReloading = false;
        });
      }, 300);
    },
    async loadScroll({done}) {
      let component = this;
      component.loading = true;
      this.requestInstances().then(function (response) {
        component.instances.push(...response.data);
        component.offset += response.data.length;

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
  background-color: #2e506c;
  color: white;

}

.search-area .gradient {
  background-size: cover !important;
  padding-top: 64px;
}

</style>
