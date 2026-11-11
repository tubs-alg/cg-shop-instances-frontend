<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {debounce} from "throttle-debounce";
import {findProblem} from "@/data/problems";
import InstancesService from "@/services/instances.service";
import InstanceCard from "@/components/InstanceCard.vue";
import RangeSliderFilters from "@/components/instances/filters/RangeSliderFilter.vue";

const PAGE_SIZE = 12;

const route = useRoute();
const problem = route.params.problem;
const problemConfig = findProblem(problem);
const service = problemConfig ? new InstancesService(problem) : null;

const problemData = ref(null);
const loadingProblem = ref(true);
const loadError = ref(false);

const search = ref("");
const filters = ref({});
const sort = ref("uid");

const instances = ref([]);
const total = ref(0);
const reloading = ref(true);
const scrollMode = ref("intersect");
// Increased on every reload, so responses of outdated requests can be dropped.
let requestId = 0;

const sortOptions = computed(() => {
  if (problemData.value === null) {
    return [];
  }

  return problemData.value["instance_sort_fields"].flatMap((field) => {
    const label = problemConfig.labels[field] ?? field;
    return [
      {title: label, value: field, prependIcon: 'mdi-sort-ascending'},
      {title: label, value: "-" + field, prependIcon: 'mdi-sort-descending'},
    ];
  });
});

function requestInstances(offset, includeCount = false) {
  return service.getInstances(search.value, filters.value, {
    limit: PAGE_SIZE,
    offset: offset,
    sort: sort.value,
    add_total_count: includeCount
  });
}

function reload() {
  const id = ++requestId;
  scrollMode.value = "manual";
  reloading.value = true;
  loadError.value = false;

  requestInstances(0, true).then((response) => {
    if (id !== requestId) {
      return;
    }
    total.value = Number(response.headers["x-total-count"] ?? response.data.length);
    instances.value = response.data;
  }).catch(() => {
    if (id === requestId) {
      instances.value = [];
      loadError.value = true;
    }
  }).finally(() => {
    if (id === requestId) {
      reloading.value = false;
      scrollMode.value = "intersect";
    }
  });
}

const debouncedReload = debounce(400, reload);

function loadMore({done}) {
  const id = requestId;
  requestInstances(instances.value.length).then((response) => {
    if (id !== requestId) {
      return done('ok');
    }
    instances.value.push(...response.data);
    done(instances.value.length >= total.value || response.data.length === 0 ? 'empty' : 'ok');
  }).catch(() => done('error'));
}

let filtersInitialized = false;

function onFiltersChanged(values) {
  filters.value = values;
  // The first call reports the initial filter values: search right away instead of waiting for the debounce.
  if (filtersInitialized) {
    debouncedReload();
  } else {
    filtersInitialized = true;
    reload();
  }
}

function resetSearch() {
  search.value = "";
}

watch(search, () => debouncedReload());
watch(sort, () => reload());

function loadProblem() {
  loadingProblem.value = true;
  loadError.value = false;
  service.getProblem().then((response) => {
    problemData.value = response.data;
    loadingProblem.value = false;
    // The filter component reports its initial values, which triggers the first search.
    if (response.data["instance_range_query_fields"].length === 0) {
      reload();
    }
  }).catch(() => {
    loadError.value = true;
    reloading.value = false;
  });
}

onMounted(() => {
  if (service) {
    loadProblem();
  }
});
</script>

<template>
  <section class="search-hero bg-hero">
    <v-container class="search-container">
      <template v-if="!problemConfig">
        <h1 class="text-headline-large font-weight-bold mb-4">Unknown problem</h1>
        <v-btn to="/" variant="outlined" color="white" prepend-icon="mdi-home">Back to the start page</v-btn>
      </template>

      <template v-else>
        <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-6">
          <div>
            <div class="hero-eyebrow">CG:SHOP {{ problemConfig.year }} · Instances</div>
            <h1 class="text-headline-large font-weight-bold">{{ problemConfig.name }}</h1>
          </div>
          <v-btn :to="'/' + problem" variant="outlined" color="white" prepend-icon="mdi-book-open-variant-outline">
            Problem definition
          </v-btn>
        </div>

        <v-card theme="dark" class="filter-card pa-4 pa-md-6" variant="flat">
          <v-text-field
              v-model="search"
              placeholder="Search instances by name"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              :loading="reloading && !loadingProblem"
              @click:clear="resetSearch"
          ></v-text-field>

          <v-skeleton-loader v-if="loadingProblem && !loadError" type="text" color="transparent"
                             class="mt-4"></v-skeleton-loader>
          <RangeSliderFilters v-else-if="problemData"
                              :fields="problemData['instance_range_query_fields']"
                              :labels="problemConfig.labels"
                              @change="onFiltersChanged"/>
        </v-card>
      </template>
    </v-container>
  </section>

  <v-container v-if="problemConfig" class="results-container">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-6">
      <div class="text-muted">
        <template v-if="reloading">Searching…</template>
        <template v-else>
          <strong class="text-high-emphasis">{{ total.toLocaleString() }}</strong>
          {{ total === 1 ? 'instance' : 'instances' }} found
        </template>
      </div>
      <v-select
          v-model="sort"
          :items="sortOptions"
          item-props
          label="Sort by"
          density="compact"
          hide-details
          class="sort-select"
      >
        <template #selection="{ internalItem }">
          <v-icon :icon="internalItem.raw.prependIcon" size="small" class="me-1"></v-icon>
          {{ internalItem.title }}
        </template>
      </v-select>
    </div>

    <v-alert v-if="loadError" type="error" variant="tonal" class="mb-6"
             title="Could not load instances"
             text="The instance server could not be reached. Please try again in a moment.">
      <template #append>
        <v-btn variant="text" @click="problemData ? reload() : loadProblem()">Retry</v-btn>
      </template>
    </v-alert>

    <v-row v-else-if="reloading">
      <v-col v-for="i in 8" :key="i" xl="3" lg="3" md="4" sm="6" cols="12">
        <v-skeleton-loader type="image, heading, text, actions" class="rounded-lg" border></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-empty-state v-else-if="instances.length === 0"
                   icon="mdi-file-search-outline"
                   title="No instances match your search"
                   text="Try a different name or widen the filter ranges.">
      <template #actions v-if="search">
        <v-btn variant="tonal" color="primary" @click="resetSearch">Clear search</v-btn>
      </template>
    </v-empty-state>

    <v-infinite-scroll v-else @load="loadMore" :mode="scrollMode" class="overflow-visible">
      <v-row>
        <v-col v-for="instance in instances" :key="instance.id" xl="3" lg="3" md="4" sm="6" cols="12">
          <v-fade-transition appear>
            <InstanceCard :instance="instance" :problem="problemConfig"/>
          </v-fade-transition>
        </v-col>
      </v-row>
      <template #empty>
        <div class="text-muted text-body-small py-4">All {{ total.toLocaleString() }} instances loaded</div>
      </template>
      <template #error="{ props }">
        <v-btn v-bind="props" variant="tonal" color="error">Loading failed, retry</v-btn>
      </template>
    </v-infinite-scroll>
  </v-container>
</template>

<style scoped>
.search-hero {
  margin-top: -64px;
  padding-top: 64px;
}

.search-container {
  max-width: 960px;
  padding-top: 40px;
  padding-bottom: 56px;
}

.hero-eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.25rem;
}

.filter-card {
  background: rgba(255, 255, 255, 0.07) !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
}

.results-container {
  padding-top: 32px;
  padding-bottom: 48px;
}

.sort-select {
  max-width: 240px;
  min-width: 200px;
}
</style>
