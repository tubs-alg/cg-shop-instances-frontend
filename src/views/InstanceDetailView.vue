<script setup>
import {computed, defineAsyncComponent, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import urlJoin from 'url-join';
import InstancesService from "@/services/instances.service";
import Problems, {findProblem} from "@/data/problems";
import InstanceSchema from "@/components/instances/InstanceSchema.vue";

// Visualizations pull in three.js, so they are only loaded when an instance actually needs one.
const visualizations = {
  MaximumPolygonPackingVisualization: () => import("@/components/visualizations/MaximumPolygonPackingVisualization.vue"),
  MinimumConvexPartitionVisualization: () => import("@/components/visualizations/MinimumConvexPartitionVisualization.vue"),
  MinimumSubgraphPartitionVisualization: () => import("@/components/visualizations/MinimumSubgraphPartitionVisualization.vue"),
  MinimumCoverageByConvexPolygonsVisualization: () => import("@/components/visualizations/MinimumCoverageByConvexPolygonsVisualization.vue"),
  MultiAgentPathFindingVisualization: () => import("@/components/visualizations/MultiAgentPathFindingVisualization.vue"),
  MinimumNonObtuseTriangulationVisualization: () => import("@/components/visualizations/MinimumNonObtuseTriangulationVisualization.vue"),
};

const route = useRoute();
const uid = route.params.identifier;
const problem = route.params.problem;
const problemConfig = findProblem(problem);
const service = problemConfig ? new InstancesService(problem) : null;

const visualizationComponent = problemConfig && visualizations[problemConfig.visualizationComponent]
    ? defineAsyncComponent(visualizations[problemConfig.visualizationComponent])
    : null;

const tab = ref('details');
const instance = ref(null);
const notFound = ref(!problemConfig);
const solutions = ref([]);
const solutionDialog = ref(false);
const solutionToVisualize = ref(null);

function buildUrl(path) {
  return urlJoin(import.meta.env.VITE_API_URL, path);
}

const downloadUrl = computed(() => buildUrl(instance.value.path));

const primaryObjective = computed(() => problemConfig.objectives[0]);

const orderedSolutions = computed(() => {
  const {key, minimization} = primaryObjective.value;
  return solutions.value.slice(0).sort((a, b) => minimization ? a[key] - b[key] : b[key] - a[key]);
});

const metaTable = computed(() => [
  {key: 'Problem', value: problemConfig.name},
  {key: 'Name', value: instance.value.uid},
  ...problemConfig.instanceCardAttributes.map((field) => ({
    key: problemConfig.labels[field],
    value: instance.value[field]?.toLocaleString()
  })),
  {key: 'Solutions', value: solutions.value.length},
]);

function showSolution(solution) {
  solutionToVisualize.value = solution;
  solutionDialog.value = true;
}

onMounted(() => {
  if (!service) {
    return;
  }

  service.getInstance(uid).then((response) => {
    instance.value = response.data;
  }).catch((error) => {
    console.error(error);
    notFound.value = true;
  });

  service.getSolutions(uid).then((response) => {
    if (problemConfig.id === Problems.MinimumConvexPartition.id) {
      response.data.forEach((solution) => {
        solution.value = solution.num_edges;
      });
    }
    solutions.value = response.data;
  }).catch((error) => {
    console.error(error);
  });
});
</script>

<template>
  <v-container class="py-8">
    <v-empty-state v-if="notFound"
                   icon="mdi-file-question-outline"
                   title="Instance not found"
                   :text="`There is no instance named “${uid}” for this problem.`">
      <template #actions>
        <v-btn v-if="problemConfig" variant="tonal" color="primary"
               :to="{name: 'instances', params: {problem}}">Search instances
        </v-btn>
        <v-btn v-else variant="tonal" color="primary" to="/">Back to the start page</v-btn>
      </template>
    </v-empty-state>

    <template v-else>
      <v-breadcrumbs class="px-0 pt-0 text-body-medium" :items="[
        {title: problemConfig.name, to: '/' + problem},
        {title: 'Instances', to: {name: 'instances', params: {problem}}},
        {title: uid, disabled: true},
      ]"></v-breadcrumbs>

      <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
        <div>
          <h1 class="text-headline-large font-weight-bold instance-name">{{ uid }}</h1>
          <div class="d-flex flex-wrap ga-2 mt-2">
            <v-chip size="small" variant="tonal" color="primary">{{ problemConfig.name }}</v-chip>
            <v-chip size="small" variant="tonal">CG:SHOP {{ problemConfig.year }}</v-chip>
            <v-chip v-if="solutions.length" size="small" variant="tonal" color="accent"
                    prepend-icon="mdi-check-decagram-outline">
              {{ solutions.length }} {{ solutions.length === 1 ? 'solution' : 'solutions' }}
            </v-chip>
          </div>
        </div>
        <v-btn v-if="instance" color="primary" variant="flat" size="large" prepend-icon="mdi-download"
               :href="downloadUrl" download target="_blank">
          Download instance
        </v-btn>
      </div>

      <v-skeleton-loader v-if="instance === null" type="heading, image, table" border
                         class="rounded-lg"></v-skeleton-loader>

      <v-card v-else variant="flat" class="detail-card">
        <v-tabs v-model="tab" color="primary" class="px-2">
          <v-tab prepend-icon="mdi-information-outline" text="Details" value="details"></v-tab>
          <v-tab v-if="instance.raw && visualizationComponent" prepend-icon="mdi-gesture-tap"
                 text="Interactive Visualization" value="visualization"></v-tab>
          <v-tab v-if="solutions.length > 0" prepend-icon="mdi-file-compare" text="Solutions"
                 value="solutions"></v-tab>
          <v-tab prepend-icon="mdi-code-json" text="Schemas" value="schemas"></v-tab>
        </v-tabs>
        <v-divider></v-divider>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="details">
            <v-card-text class="pa-md-6">
              <v-row>
                <v-col cols="12" lg="5">
                  <v-table density="comfortable" class="meta-table">
                    <tbody>
                    <tr v-for="meta in metaTable" :key="meta.key">
                      <th class="text-capitalize">{{ meta.key }}</th>
                      <td>{{ meta.value }}</td>
                    </tr>
                    </tbody>
                  </v-table>
                </v-col>
                <v-col cols="12" lg="7">
                  <div v-if="instance.image" class="image-frame">
                    <vue-image-zoomer :regular="buildUrl(instance.image)" click-zoom/>
                  </div>
                  <v-alert v-else type="info" variant="tonal">
                    For this instance, there is no visualization available.
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>
          </v-tabs-window-item>

          <v-tabs-window-item v-if="instance.raw && visualizationComponent" value="visualization">
            <v-card-text>
              <component :is="visualizationComponent" :url="service.getInstanceRawUrl(instance.uid)"/>
            </v-card-text>
          </v-tabs-window-item>

          <v-tabs-window-item v-if="solutions.length > 0" value="solutions">
            <v-card-text>
              <v-table hover>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Solution</th>
                  <th v-for="objective in problemConfig.objectives" :key="objective.key" class="text-capitalize">
                    {{ objective.key.replaceAll('_', ' ') }}
                    <v-icon size="x-small" class="ms-1"
                            :icon="objective.minimization ? 'mdi-arrow-down' : 'mdi-arrow-up'"
                            v-tooltip="objective.minimization ? 'Lower is better' : 'Higher is better'"></v-icon>
                  </th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(solution, index) in orderedSolutions" :key="solution.id">
                  <td class="text-medium-emphasis">{{ index + 1 }}</td>
                  <td class="font-mono">
                    {{ solution.uid }}
                    <v-chip v-if="index === 0" size="x-small" color="secondary" variant="flat" class="ms-2">
                      best
                    </v-chip>
                  </td>
                  <td v-for="objective in problemConfig.objectives" :key="objective.key">
                    {{ solution[objective.key]?.toLocaleString() }}
                  </td>
                  <td class="text-end text-no-wrap">
                    <v-btn v-if="solution.raw && visualizationComponent"
                           @click="showSolution(solution)"
                           variant="text" size="small"
                           icon="mdi-eye-outline" aria-label="Show solution"></v-btn>
                    <v-btn :href="buildUrl(solution.path)"
                           variant="text" size="small"
                           download target="_blank" icon="mdi-download" aria-label="Download solution">
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </v-table>

              <v-dialog v-model="solutionDialog" max-width="1000">
                <v-card v-if="solutionToVisualize" prepend-icon="mdi-eye-outline"
                        :title="'Solution ' + solutionToVisualize.uid">
                  <template #append>
                    <v-btn icon="mdi-close" variant="text" @click="solutionDialog = false"
                           aria-label="Close"></v-btn>
                  </template>
                  <v-card-text>
                    <div class="d-flex flex-wrap ga-2 mb-3">
                      <v-chip v-for="objective in problemConfig.objectives" :key="objective.key" size="small"
                              variant="tonal">
                        <span class="text-capitalize me-1">{{ objective.key.replaceAll('_', ' ') }}:</span>
                        <strong>{{ solutionToVisualize[objective.key]?.toLocaleString() }}</strong>
                      </v-chip>
                    </div>
                    <component :is="visualizationComponent"
                               :url="service.getInstanceRawUrl(instance.uid)"
                               :solution-url="service.getSolutionRawUrl(instance.uid, solutionToVisualize.uid)"/>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card-text>
          </v-tabs-window-item>

          <v-tabs-window-item value="schemas">
            <v-card-text>
              <InstanceSchema :problem-id="problem"/>
            </v-card-text>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </template>
  </v-container>
</template>

<style scoped>
.instance-name {
  word-break: break-all;
}

.detail-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.meta-table th {
  width: 40%;
  font-weight: 600;
  color: var(--cg-text-muted);
}

.image-frame {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.85rem;
}
</style>
