<script setup>
import {computed, onMounted, ref, watch} from "vue";
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import InstancesService from "@/services/instances.service";

const props = defineProps({
  problemId: {type: String, required: true},
});

const languages = {
  json: 'json',
  pydantic: 'python',
};

const service = new InstancesService(props.problemId);
const format = ref('json');
const schema = ref(null);
const copied = ref(false);

const highlighted = computed(() => schema.value === null
    ? ''
    : Prism.highlight(schema.value, Prism.languages[languages[format.value]], languages[format.value]));

function updateSchema() {
  schema.value = null;
  const requested = format.value;
  service.getInstanceSchema(requested).then((response) => {
    if (requested === format.value) {
      schema.value = requested === 'json' ? JSON.stringify(response.data, null, 4) : response.data;
    }
  });
}

function copy() {
  navigator.clipboard.writeText(schema.value).then(() => {
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  });
}

watch(format, updateSchema);
onMounted(updateSchema);
</script>

<template>
  <div class="d-flex align-center justify-space-between mb-2">
    <v-btn-toggle v-model="format" mandatory density="compact" variant="outlined" color="primary" divided>
      <v-btn value="json">JSON Schema</v-btn>
      <v-btn value="pydantic">Pydantic</v-btn>
    </v-btn-toggle>
    <v-btn :disabled="schema === null" variant="text" size="small" @click="copy"
           :prepend-icon="copied ? 'mdi-check' : 'mdi-content-copy'">
      {{ copied ? 'Copied' : 'Copy' }}
    </v-btn>
  </div>

  <div class="code-block">
    <div v-if="schema === null" class="code-loader">
      <v-progress-circular color="white" indeterminate></v-progress-circular>
    </div>
    <pre v-else :class="'language-' + languages[format]"><code v-html="highlighted"></code></pre>
  </div>
</template>

<style scoped>
.code-block pre {
  margin: 0;
  border-radius: 8px;
  max-height: 600px;
  overflow: auto;
  font-size: 0.85rem;
}

.code-loader {
  border-radius: 8px;
  background: #2d2d2d;
  text-align: center;
  padding: 5em;
}
</style>
