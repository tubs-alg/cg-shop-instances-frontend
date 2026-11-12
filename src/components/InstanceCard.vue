<script setup>
import {computed} from "vue";
import urlJoin from 'url-join';
import noPreviewImg from "@/assets/no_preview.png";

const props = defineProps({
  instance: {type: Object, required: true},
  // Problem configuration from `@/data/problems`.
  problem: {type: Object, required: true}
});

const detailLink = computed(() => ({
  name: 'instance_detail',
  params: {identifier: props.instance.uid, problem: props.problem.id}
}));

const thumbnail = computed(() => props.instance.thumbnail
    ? urlJoin(import.meta.env.VITE_API_URL, props.instance.thumbnail)
    : noPreviewImg);

const download = computed(() => urlJoin(import.meta.env.VITE_API_URL, props.instance.path));

const attributes = computed(() => props.problem.instanceCardAttributes.map((field) => ({
  label: props.problem.labels[field],
  value: props.instance[field]
})));
</script>

<template>
  <v-card class="instance-card h-100 d-flex flex-column" variant="flat">
    <router-link :to="detailLink" class="thumbnail">
      <v-img :src="thumbnail" height="190" cover :alt="'Preview of ' + instance.uid">
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate size="24" color="grey-lighten-1"></v-progress-circular>
          </div>
        </template>
      </v-img>
      <v-chip v-if="instance.raw" class="live-chip" size="x-small" variant="flat" color="primary"
              prepend-icon="mdi-gesture-tap">
        Interactive
      </v-chip>
    </router-link>

    <v-card-item class="pb-1">
      <v-card-title class="instance-title" :title="instance.uid">
        <router-link :to="detailLink" class="text-decoration-none text-high-emphasis">{{ instance.uid }}</router-link>
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-1">
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="attribute in attributes" :key="attribute.label" size="small" variant="tonal">
          <strong class="me-1">{{ attribute.value?.toLocaleString() }}</strong> {{ attribute.label }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="px-3">
      <v-btn :to="detailLink" variant="text" color="primary" prepend-icon="mdi-eye-outline">Details</v-btn>
      <v-spacer></v-spacer>
      <v-btn :href="download" download target="_blank" icon="mdi-download" variant="text" size="small"
             :aria-label="'Download ' + instance.uid" v-tooltip:top="'Download instance'"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.instance-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.instance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(29, 52, 70, 0.12);
}

.thumbnail {
  position: relative;
  display: block;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.live-chip {
  position: absolute;
  top: 10px;
  right: 10px;
}

.instance-title {
  font-size: 1rem;
  font-weight: 600;
}
</style>
