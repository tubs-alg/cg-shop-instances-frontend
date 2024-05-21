<template>
  <v-range-slider label="Size"
                  class="mt-3"
                  :step="1"
                  v-model="size"
                  :max="data.size_max"
                  :min="data.size_min"
                  thumb-label="always"
  ></v-range-slider>
</template>

<script>
export default {
  name: 'MaximumPolygonPackingFilters',
  props: {
    data: Object
  },
  watch: {
    size() {
      this.$emit('filtersChanged')
    }
  },
  data() {
    return {
      size: [this.data.size_min, this.data.size_max]
    }
  },
  mounted() {
    console.log(this.data)
  },
  methods: {
    filter() {
      return {
        size_ge: this.size[0],
        size_le: this.size[1],
      }
    }
  }
}
</script>

<style scoped>

</style>