<template>
  <v-container class="text-center">
    <v-progress-circular
        indeterminate
        color="primary"
        v-if="instance === null"
    ></v-progress-circular>
  </v-container>

  <v-container class="text-center" v-if="instance">
    <v-btn icon="mdi-chevron-left" @click="getBack" class="float-left"></v-btn>
    <h1>
      {{ instance.uid }}
      <v-icon icon="mdi-heart" color="red" size="32" v-if="isFavorite"></v-icon>
    </h1>

    <v-row align="center">
      <v-col lg="6">
        <v-table class="text-caption">
          <thead>
          <tr>
            <th class="text-left">Attribute</th>
            <th class="text-left">Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="meta in metaTable" :key="meta.key">
            <td>{{ meta.key }}</td>
            <td>{{ meta.value }}</td>
          </tr>
          </tbody>
        </v-table>
        <a :href="buildUrl(instance.path)" download="download" target="_blank">
          <v-chip prepend-icon="mdi-download" label>
            Download
          </v-chip>
        </a>

        <v-chip prepend-icon="mdi-eye" label class="ms-3"
                v-if="!liveVisualization"
                @click="liveVisualization = !liveVisualization">
          Live Visualization
        </v-chip>

      </v-col>
      <v-col lg="6">
        <vue-image-zoomer :regular="instance.image" click-zoom v-if="instance.image"/>
        <div v-if="instance.image === null">
          <v-alert type="warning">
            No static visualization available
          </v-alert>
        </div>
      </v-col>
    </v-row>

    <MaximumPolygonPackingVisualization
        :instance="instance"
        v-if="isMaximumPolygonPacking && liveVisualization"/>
  </v-container>


</template>

<script>
import InstancesService from "@/services/instances.service";
import UserService from "@/services/user.service";
import MaximumPolygonPackingVisualization from "@/components/visualizations/MaximumPolygonPackingVisualization.vue";
import Problems from "@/data/problems";

export default {
  name: 'InstanceDetailView',
  computed: {
    isMaximumPolygonPacking() {
      return this.problem === Problems.MaximumPolygonPacking.id
    },
    metaTable() {
      let problemName = this.isMaximumPolygonPacking? Problems.MaximumPolygonPacking.name : "unknown";

      return [
        {key: 'Problem', value: problemName},
        {key: 'Name', value: this.instance.uid},
        {key: '#items', value: this.instance.num_items},
      ]
    }
  },
  components: {MaximumPolygonPackingVisualization},
  data: function () {
    return {
      uid: this.$route.params.identifier,
      problem: this.$route.params.problem,
      isFavorite: false,
      instance: null,
      liveVisualization: false
    }
  },
  mounted() {
    (new InstancesService(this.problem)).getInstance(this.uid).then((response) => {
      console.log(response.data)
      this.instance = response.data
      this.isFavorite = UserService.isFavorite(this.instance)
    }).catch((error) => {
      console.error(error)
    });
  },
  methods: {
    buildUrl(path) {
      if (path === null) {
        return null
      }

      if (path.startsWith('/')) {
        path = path.substring(1)
      }
      return process.env.VUE_APP_API_URL + path
    },
    getBack() {
      this.$router.go(-1);
    }
  }
}
</script>
