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
      {{ instance.identifier }}
      <v-icon icon="mdi-heart" color="red" size="32" v-if="isFavorite"></v-icon>
    </h1>

    <v-row>
      <v-col lg="6">
        <v-table class="text-caption">
          <thead>
          <tr>
            <th class="text-left">Attribute</th>
            <th class="text-left">Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="meta in instance.meta" :key="meta.key">
            <td>{{ meta.key }}</td>
            <td>{{ meta.value }}</td>
          </tr>
          </tbody>
        </v-table>
        <a :href="instance.file" download="download" target="_blank">
          <v-chip prepend-icon="mdi-download" label>
            Download
          </v-chip>
        </a>
      </v-col>
      <v-col lg="6">
        <vue-image-zoomer :regular="instance.preview_detail" click-zoom/>
      </v-col>
    </v-row>
  </v-container>


</template>

<script>
import InstancesService from "@/services/instances.service";
import UserService from "@/services/user.service";

export default {
  name: 'InstanceDetailView',
  data: function () {
    return {
      identifier: this.$route.params.identifier,
      problem: this.$route.params.problem,
      isFavorite: false,
      instance: null
    }
  },
  mounted() {
    InstancesService.getInstance(this.problem, this.identifier).then((response) => {
      this.instance = response.data
      this.isFavorite = UserService.isFavorite(this.instance)
    });
  },
  methods: {
    getBack() {
      this.$router.go(-1);
    }
  }
}
</script>
