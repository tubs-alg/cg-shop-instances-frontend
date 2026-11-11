<script setup>
defineProps({
  // Problem configuration from `@/data/problems`.
  problem: {type: Object, required: true}
});
</script>

<template>
  <header class="problem-header d-flex flex-wrap flex-md-nowrap align-center ga-6 mb-8">
    <img :src="problem.image" class="problem-thumb hidden-xs" :alt="problem.name">
    <div class="flex-grow-1">
      <div class="eyebrow mb-1">CG:SHOP {{ problem.year }} · Problem definition</div>
      <h1 class="problem-name mb-2">{{ problem.name }}</h1>
      <p class="text-muted">{{ problem.description }}</p>
    </div>
    <v-btn color="primary" variant="flat" size="large" class="flex-shrink-0"
           prepend-icon="mdi-database-search-outline"
           :to="{name: 'instances', params: {problem: problem.id}}">
      Browse instances
    </v-btn>
  </header>
</template>

<style scoped>
.problem-header {
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.problem-thumb {
  width: 132px;
  height: 132px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
}

.eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-secondary));
}

.problem-name {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
</style>
