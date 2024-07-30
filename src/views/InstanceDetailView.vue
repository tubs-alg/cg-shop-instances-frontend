<template>
  <v-container class="text-center">
    <v-progress-circular
        indeterminate
        color="primary"
        v-if="instance === null"
    ></v-progress-circular>
  </v-container>


  <v-container v-if="instance">
    <v-btn icon="mdi-chevron-left" @click="getBack" class="float-left"></v-btn>

    <h1 class="text-center">
      {{ instance.uid }}
      <v-icon icon="mdi-heart" color="red" size="32" v-if="isFavorite"></v-icon>
    </h1>

    <div class="mt-5">
      <v-tabs
          v-model="tab"
          color="primary"
          align-tabs="end"
          direction="horizontal"
      >
        <v-tab prepend-icon="mdi-information" text="Details" value="details"></v-tab>
        <v-tab prepend-icon="mdi-gesture-tap" text="Interactive Visualization" value="visualization"
               v-if="instance.raw"></v-tab>
        <v-tab v-if="solutions.length > 0" prepend-icon="mdi-file-compare" text="Solutions" value="solutions"></v-tab>
        <v-tab prepend-icon="mdi-ev-plug-type1" text="Schemas" value="schemas"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="details">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col lg="6">
                  <v-table class="text-caption">
                    <thead>
                    <tr>
                      <th class="font-weight-bold">Attribute</th>
                      <th class="font-weight-bold">Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="meta in metaTable" :key="meta.key">
                      <td>{{ meta.key }}</td>
                      <td>{{ meta.value }}</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <div class="text-center mt-3">
                    <a :href="buildUrl(instance.path)" download="download" target="_blank">
                      <v-chip prepend-icon="mdi-download" label>
                        Download
                      </v-chip>
                    </a>
                  </div>

                </v-col>
                <v-col lg="6" align-self="center">
                  <vue-image-zoomer :regular="buildUrl(instance.image)" click-zoom v-if="instance.image"/>
                  <div v-if="instance.image === null">
                    <v-alert type="info">
                      For this instance, there is no visualization available.
                    </v-alert>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="visualization" v-if="instance.raw">
          <v-card flat>
            <v-card-text>
              <component :is="problemConfig.visualizationComponent"
                         v-if="problemConfig.visualizationComponent"
                         :url="service.getInstanceRawUrl(instance.uid)"/>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="solutions" v-if="solutions.length > 0">
          <v-card flat>
            <v-card-text>
              <v-table>
                <thead>
                <tr>
                  <th class="text-left">Solution</th>
                  <th class="text-left" v-for="objective in problemConfig.objectives" :key="objective.key">
                    {{ objective.key }}
                  </th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="solution in orderedSolutions" :key="solution.id">
                  <td>{{ solution.uid }}</td>
                  <td  v-for="objective in problemConfig.objectives" :key="objective.key">{{ solution[objective.key] }}</td>
                  <td class="text-end">
                    <v-btn v-if="solution.raw"
                           @click="solutionDialog = true; solutionToVisualize = solution;"
                           flat
                           icon="mdi-eye"></v-btn>
                    <v-btn :href="buildUrl(solution.path)"
                           flat
                           download="download"
                           target="_blank" icon="mdi-download">
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </v-table>

              <v-dialog
                  v-model="solutionDialog"
                  max-width="1000"
              >
                <v-card prepend-icon="mdi-eye"
                        :title="'Solution ' + solutionToVisualize.uid">
                  <v-card-text>
                    <div v-for="objective in problemConfig.objectives" :key="objective.key">
                      <strong>{{ objective.key }}:</strong> {{ solutionToVisualize[objective.key] }}
                    </div>
                    <component :is="problemConfig.visualizationComponent"
                               v-if="problemConfig.visualizationComponent"
                               :url="service.getInstanceRawUrl(instance.uid)"
                               :solution-url="service.getSolutionRawUrl(instance.uid, solutionToVisualize.uid)"/>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        text="Close"
                        variant="plain"
                        @click="solutionDialog = false"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="schemas">
          <v-card flat class="py-5">
            <InstanceSchema :problem-id="problem"/>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

  </v-container>

</template>

<script>
import InstancesService from "@/services/instances.service";
import UserService from "@/services/user.service";
import MaximumPolygonPackingVisualization from "@/components/visualizations/MaximumPolygonPackingVisualization.vue";
import MinimumConvexPartitionVisualization from "@/components/visualizations/MinimumConvexPartitionVisualization.vue";
import MinimumSubgraphPartitionVisualization from "@/components/visualizations/MinimumSubgraphPartitionVisualization.vue";
import MinimumCoverageByConvexPolygonsVisualization from "@/components/visualizations/MinimumCoverageByConvexPolygonsVisualization.vue";
import MultiAgentPathFindingVisualization from "@/components/visualizations/MultiAgentPathFindingVisualization.vue";
import MinimumNonObtuseTriangulationVisualization from "@/components/visualizations/MinimumNonObtuseTriangulationVisualization.vue";
import Problems from "@/data/problems";
import urlJoin from 'url-join';
import InstanceSchema from "@/components/instances/InstanceSchema.vue";

export default {
  name: 'InstanceDetailView',
  computed: {
    problemConfig() {
      return Object.values(Problems).find((p) => {
        return p.id === this.problem;
      });
    },
    orderedSolutions() {
      const key = this.problemConfig.objectives[0].key;
      const isMinimization = this.problemConfig.objectives[0].minimization;
      if (isMinimization) {
        return this.solutions.slice(0).sort((a, b) => a[key] - b[key])
      }

      return this.solutions.slice(0).sort((a, b) => b[key] - a[key])
    },
    problemName() {
      return this.problemConfig.name
    },
    metaTable() {
      let meta = [
        {key: 'Problem', value: this.problemName},
        {key: 'Name', value: this.instance.uid},
      ];
      this.problemConfig.instanceCardAttributes.forEach((field) => {
        meta.push({
          key: this.problemConfig.labels[field],
          value: this.instance[field]
        })
      });

      meta.push({key: '#solutions', value: this.solutions.length});

      return meta
    }
  },
  components: {
    InstanceSchema,
    MinimumConvexPartitionVisualization,
    MaximumPolygonPackingVisualization,
    MinimumSubgraphPartitionVisualization,
    MinimumCoverageByConvexPolygonsVisualization,
    MultiAgentPathFindingVisualization,
    MinimumNonObtuseTriangulationVisualization
  },
  data: function () {
    return {
      tab: 'details',
      solutionDialog: false, // handles the solution dialog
      solutionToVisualize: null,
      uid: this.$route.params.identifier,
      problem: this.$route.params.problem,
      isFavorite: false,
      instance: null,
      liveVisualization: false,
      service: new InstancesService(this.$route.params.problem),
      solutions: [],
    }
  },
  mounted() {
    this.service.getInstance(this.uid).then((response) => {
      this.instance = response.data
      this.isFavorite = UserService.isFavorite(this.instance)
    }).catch((error) => {
      console.error(error)
    });

    this.service.getSolutions(this.uid).then((response) => {
      this.solutions = response.data
      if (this.problemConfig.id === Problems.MinimumConvexPartition.id) {
        this.solutions.forEach((solution) => {
          solution.value = solution.num_edges;
        })
      }
    }).catch((error) => {
      console.error(error)
    });
  },
  methods: {
    buildUrl(path) {
      return urlJoin(process.env.VUE_APP_API_URL, path);
    },
    getBack() {
      this.$router.go(-1);
    }
  }
}
</script>
