<template>
  <v-container>
    <h1>My favorites</h1>
    <div class="text-center">
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
    </div>
    <div class="d-flex flex-wrap" v-if="!loading">
      <v-col v-for="instance in instances" :key="instance.identifier">
        <v-slide-x-transition appear>
          <InstanceCard :instance="instance" v-show="true" :problems="problems" :filters="[]"></InstanceCard>
        </v-slide-x-transition>
      </v-col>
    </div>
  </v-container>
</template>

<script>
import InstanceCard from "@/components/InstanceCard.vue";
import UserService from "@/services/user.service";
import InstancesService from "@/services/instances.service";

export default {
  name: 'FavoritesView',
  components: {InstanceCard},
  computed: {},
  data() {
    return {
      loading: true,
      instances: null,
      problems: []
    }
  },
  mounted() {
    InstancesService.getProblems().then((response) => {
      this.problems = response.data;
      this.instances = UserService.getFavorites();
      this.loading = false
    });
  }
};
</script>
