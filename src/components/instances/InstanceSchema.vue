<script setup>
import VCodeBlock from '@wdns/vue-code-block';

</script>

<template>

  <v-tabs
      v-model="format"
      align-tabs="end"
  >
    <v-tab value="json">JSON</v-tab>
    <v-tab value="pydantic">Pydantic</v-tab>
  </v-tabs>
  <v-scroll-x-transition hide-on-leave>
  <VCodeBlock :code="schema" :lang="languages[format]" prismjs theme="tomorrow" v-if="schema"/>
  <div class="code-loader" v-if="!schema">
    <v-progress-circular
        color="white"
        indeterminate
    ></v-progress-circular>
  </div>
  </v-scroll-x-transition>
</template>

<script>

import Problems from "@/data/problems";
import InstancesService from "@/services/instances.service";
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';

export default {
  name: 'InstanceSchema',
  props: {
    problemId: String,
  },
  watch: {
    format() {
      this.updateSchema();
    }
  },
  computed: {
    problem() {
      return Object.values(Problems).find((p) => {
        return p.id === this.problem;
      });
    }
  },
  data() {
    return {
      format: 'json',
      languages: {
        "json": 'json',
        "pydantic": 'python'
      },
      service: new InstancesService(this.problemId),
      schema: null
    };
  },
  mounted() {
    this.updateSchema();
  },
  methods: {
    updateSchema() {
      this.schema = null;

      this.service.getInstanceSchema(this.format).then((response) => {

        setTimeout(() => {
          this.schema = response.data;

          if (this.format === 'json') {
            this.schema = JSON.stringify(response.data, null, 4);
          } else {
            this.schema = response.data;
          }
        }, 300);
      });
    }
  }
}
</script>

<style scoped>
.code-loader {
  border-radius: .3em;
  background: #2d2d2d;
  text-align: center;
  padding: 5em;
}
</style>