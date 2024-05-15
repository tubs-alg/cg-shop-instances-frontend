<template>
  <div class="text-center">
    <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
  </div>

  <v-container v-if="!loading">
    <v-row>
      <v-col v-for="instancePackage in packages" :key="instancePackage.id" lg="3" md="4">
        <v-slide-x-transition appear>
          <PackageCard :instancePackage="instancePackage" v-show="true"></PackageCard>
        </v-slide-x-transition>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import axios from "axios";
import PackageCard from "@/components/PackageCard.vue";

export default {
  name: 'InstancePackages',
  components: {
    PackageCard
  },
  data: function () {
    return {
      "packages": [],
      "loading": true
    }
  },
  mounted() {
    let component = this;
    axios.get("http://localhost:8000/api/packages").then(function (response) {
      component.packages = response.data.packages;
      component.loading = false;
    }).catch(function (error) {
      console.log(error);
    });
  }
}
</script>
