<template>
  <v-card class="me-3 mb-3">
    <div class="position-relative">
      <div class="position-absolute chips">
        <v-chip v-for="(chip, idx) in chips" :key="idx" variant="flat"  color="white" size="x-small" class="me-1 mt-1">
          <v-icon start icon="mdi-label"></v-icon>
          {{ chip }}
        </v-chip>
      </div>
    </div>

    <v-img
        :src="instance.preview? instance.preview : require('@/assets/no_preview.png')"
        height="200px"
        cover
    ></v-img>


    <v-card-title>
      {{ instance.uid }}
    </v-card-title>

    <v-card-subtitle>
      Size: {{ instance.num_items }}
    </v-card-subtitle>

    <v-card-actions>
      <router-link :to="{name: 'instance_detail', params: {
          identifier: instance.uid,
          problem: problem
        }}">
        <v-btn icon="mdi-eye"></v-btn>
      </router-link>

      <v-btn icon>
        <div :class="favoriteClass" @click="toggleFavorite"></div>
      </v-btn>

      <v-spacer></v-spacer>

      <a :href="instance.file" download target="_blank" class="text-black">
        <v-btn icon="mdi-download">
        </v-btn>
      </a>

    </v-card-actions>

  </v-card>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: "InstanceCard",
  props: {
    instance: Object,
    problem: String
  },
  computed: {
    favoriteClass() {
      return this.isFavorite ? (this.animate ? "heart animate" : "heart favorite") : "heart"
    }
  },
  data: (obj) => {
    let chips = []

    return {
      chips: chips,
      isFavorite: UserService.isFavorite(obj.instance),
      animate: false
    }
  },
  methods: {
    toggleFavorite() {
      let component = this;

      UserService.toggleFavorite(this.instance);
      component.animate = !component.isFavorite;
      component.isFavorite = !component.isFavorite
    }
  }
}
</script>

<style scoped>
.chips {
  z-index: 1;
  background: linear-gradient(180deg, rgba(30,30,30, 1) 0%, rgba(30,30,30, .7) 40%, rgba(30,30,30, 0) 100%);
  width: 100%;
  display: flex;
  justify-content: end;
  flex-wrap: wrap;
  padding-bottom: 30px
}

.heart {
  padding-top: 2em;
  background-image: url('../assets/web_heart_animation.png');
  background-repeat: no-repeat;
  background-size: 2900%;
  background-position: left;
  height: 50px;
  width: 50px;
  cursor: pointer;
}

.animate {
  animation: heart-burst .8s steps(28) forwards;
}

.favorite {
  background-position: right;
}

@keyframes heart-burst {
  0% {
    background-position: left
  }
  100% {
    background-position: right
  }
}
</style>