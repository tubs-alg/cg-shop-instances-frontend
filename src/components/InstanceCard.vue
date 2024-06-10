<template>
  <v-card class="me-3 mb-3">
    <div class="position-relative">
      <div class="position-absolute chips">
        <v-chip v-for="(chip, idx) in chips" :key="idx" variant="flat" color="white" size="x-small" class="me-1 mt-1">
          <v-icon start icon="mdi-label"></v-icon>
          {{ chip }}
        </v-chip>
      </div>
    </div>

    <v-img
        :src="thumbnail"
        height="200px"
        cover
    ></v-img>


    <v-card-title>
      {{ instance.uid }}
    </v-card-title>

    <v-card-subtitle>
      <div v-for="(item, i) in instanceData" :key="i">
        {{ item.label }}: {{ item.value }}
      </div>
    </v-card-subtitle>

    <v-card-actions>
      <router-link :to="{name: 'instance_detail', params: {
          identifier: instance.uid,
          problem: problem
        }}">
        <v-btn icon="mdi-eye"></v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <a :href="download" download target="_blank" class="text-black">
        <v-btn icon="mdi-download">
        </v-btn>
      </a>

    </v-card-actions>

  </v-card>
</template>

<script>
import UserService from '../services/user.service';
import Problems from "@/data/problems";
import urlJoin from 'url-join';

export default {
  name: "InstanceCard",
  props: {
    instance: Object,
    problem: String
  },
  computed: {
    thumbnail() {
      return this.instance.thumbnail ? urlJoin(process.env.VUE_APP_API_URL, this.instance.thumbnail) :
          require('@/assets/no_preview.png')
    },
    download() {
      return urlJoin(process.env.VUE_APP_API_URL, this.instance.path)
    },
    instanceData() {
      let problem = Object.values(Problems).find((p) => p.id === this.problem);

      if (problem) {
        return problem.instanceCardAttributes.map((field) => {
          return {
            label: problem.labels[field],
            value: this.instance[field]
          }
        })
      }

      return []
    }
  },
  data: (obj) => {
    let chips = []

    if (obj.instance.raw) {
      chips.push("live visualization")
    }

    return {
      chips: chips,
      animate: false
    }
  },
}
</script>

<style scoped>
.chips {
  z-index: 1;
  background: linear-gradient(180deg, rgba(30, 30, 30, 1) 0%, rgba(30, 30, 30, .7) 40%, rgba(30, 30, 30, 0) 100%);
  width: 100%;
  display: flex;
  justify-content: end;
  flex-wrap: wrap;
  padding-bottom: 30px
}
</style>