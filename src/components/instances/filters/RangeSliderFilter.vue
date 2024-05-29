<template>

  <v-range-slider :label="problemConfig.labels[field.field_name]? problemConfig.labels[field.field_name] : field.field_name"
                  class="mt-3"
                  :step="1"
                  v-model="this.values[field.field_name]"
                  :max="field.max_value"
                  :min="field.min_value"
                  thumb-label="always"
                  v-for="field of fields"
                  :key="field.field_name"
  ></v-range-slider>
</template>

<script>
export default {
  name: 'RangeSliderFilters',
  props: {
    fields: Object,
    problemConfig: Object
  },
  emits: ['change'],
  watch: {
    values: {
      handler() {
        this.$emit('change')
      },
      deep: true
    }
  },
  data() {
    let values = {}

    for (let field of this.fields) {
      values[field.field_name] = [field.min_value, field.max_value]
    }

    return {
      values: values
    };
  },
  methods: {
    filter() {
      let filters = {}

      for (let field of this.fields) {
        filters[field.field_name + "_ge"] = this.values[field.field_name][0]
        filters[field.field_name + "_le"] = this.values[field.field_name][1]
      }
      return filters;
    }
  }
}
</script>

<style scoped>

</style>