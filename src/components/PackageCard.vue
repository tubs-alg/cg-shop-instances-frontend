<template>
  <v-card class="me-3 mb-3">
    <v-img
        :src="instancePackage.visualization"
        height="200px"
        cover
    ></v-img>

    <v-card-title>
      {{ instancePackage.name }}
    </v-card-title>

    <v-card-subtitle>{{ instancePackage.size }} instances</v-card-subtitle>

    <v-card-actions>
      <v-spacer></v-spacer>
      <a :href="instancePackage.data" download target="_blank" class="text-black">
        <v-btn icon="mdi-download">
        </v-btn>
      </a>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "PackageCard",
  props: {
    instancePackage: Object
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  data: () => {
    return {
      animate: false
    }
  }
}
</script>