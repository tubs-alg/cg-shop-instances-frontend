<script setup>
defineProps({
  problem: {type: Object, required: true}
})
</script>

<template>
  <v-card class="problem-card h-100 d-flex flex-column" variant="flat">
    <router-link :to="'/' + problem.id" class="problem-image">
      <v-img :src="problem.image" aspect-ratio="1.6" cover :alt="problem.name"></v-img>
      <v-chip class="year-chip" size="small" variant="flat" color="surface">CG:SHOP {{ problem.year }}</v-chip>
    </router-link>

    <v-card-item>
      <v-card-title class="problem-title">{{ problem.name }}</v-card-title>
    </v-card-item>

    <v-card-text class="text-muted flex-grow-1">
      {{ problem.description }}
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn variant="tonal" color="primary" append-icon="mdi-arrow-right" :to="'/' + problem.id">
        Definition
      </v-btn>
      <v-btn variant="text" color="primary" prepend-icon="mdi-database-search-outline"
             :to="{name: 'instances', params: {problem: problem.id}}">
        Instances
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.problem-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.problem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(29, 52, 70, 0.14);
}

.problem-image {
  display: block;
  position: relative;
  background: white;
}

.year-chip {
  position: absolute;
  top: 12px;
  left: 12px;
  font-weight: 600;
}

.problem-title {
  white-space: normal;
  font-weight: 600;
  line-height: 1.3;
}
</style>
