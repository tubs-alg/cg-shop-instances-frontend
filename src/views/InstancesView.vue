<script setup>
import Problems from "@/data/problems";
</script>
<template>
  <div class="search-area">
    <div class="gradient">
      <v-container>
        <v-tabs
            v-model="problem"
            align-tabs="center"
        >
          <v-tab :value="prob.id"
                 v-for="prob in problems"
                 :key="prob.id">
            {{ prob.name }}
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

          <MaximumPolygonPackingFilters :data="problemData"
                                        ref="filterComponent"
                                        @filtersChanged="filtersChanged"
                                        v-if="problem === Problems.MaximumPolygonPacking.id"/>

          <div class="text-end">
            <router-link :to="'/' + problem" class="text-white">
              <v-btn variant="outlined" append-icon="mdi-open-in-new">Learn more about this problem</v-btn>
            </router-link>
          </div>
        </v-container>
      </v-card>
    </div>
  </div>
  <v-container class="d-flex justify-space-between align-center mt-3">
    <span class="text-grey">{{ n }} instances found</span>
    <v-select
        single-line
        max-width="200"
        v-model="sort"
        :items="sortOptions"
        label="Sort by"
        class="me-5"
        rounded="rounded-xl"
    >
      <template #selection="{ props, item }">
        <v-list-item v-bind="props" :title="sortOptionTitle(item)"
                     :prepend-icon="sortOptionIcon(item)">
        </v-list-item>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props"
                     :title="sortOptionTitle(item)"
                     :prepend-icon="sortOptionIcon(item)">
        </v-list-item>
      </template>

    </v-select>
  </v-container>


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
import MaximumPolygonPackingFilters from "@/components/instances/filters/MaximumPolygonPackingFilters.vue";

export default {
  name: 'InstancesView',
  components: {
    MaximumPolygonPackingFilters,
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
    }
  },
  data: function () {
    return {
      "problems": Object.keys(Problems).map((key) => {
        return Problems[key];
      }),
      "search": "",
      "problem": Problems.MaximumPolygonPacking.id,
      "problemData": {},
      "instances": [],
      "sortOptions": ["-uid", "uid", "-size", "size"],
      "sort": "uid",
      "n": 0,
      "limit": 10,
      "offset": 0,
      "scrollMode": "intersect",
      "showReload": true,
      "currentlyReloading": true,
      "currentlyUpdatingFilters": true,
    }
  },
  mounted() {
    this.updateFilters();
  },
  methods: {
    sortOptionTitle(option){
      const mappings = {
        "-uid": "name",
        "uid": "name",
        "-size": "size",
        "size": "size"
      }

      return mappings[option.title];
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
    requestInstances() {
      let component = this;
      return this.service.getInstances(component.search,
          this.getFilterValues(), {
            limit: component.limit,
            offset: component.offset,
            sort: component.sort
          });
    },
    reload() {
      let component = this;
      component.scrollMode = "manual"
      component.instances = []
      component.offset = 0;
      component.currentlyReloading = true

      setTimeout(() => {
        this.requestInstances().then(function (response) {
          component.n = "xxx"
          component.instances = response.data
          component.scrollMode = "intersect"
          component.showReload = false;
          component.currentlyReloading = false;
          component.offset += response.data.length
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
