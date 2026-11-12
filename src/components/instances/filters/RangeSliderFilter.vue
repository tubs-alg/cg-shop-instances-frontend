<script setup>
import {reactive, watch} from "vue";

const props = defineProps({
  fields: {type: Array, required: true},
  labels: {type: Object, default: () => ({})}
});

// Emits the query parameters (`<field>_ge`, `<field>_le`) of the current ranges, initially and on every change.
const emit = defineEmits(['change']);

// Ranges spanning several orders of magnitude (e.g. 10 to 1,000,000 points) are only usable on a log scale.
const LOG_SCALE_RATIO = 1000;
const LOG_STEPS = 1000;

const scales = Object.fromEntries(props.fields.map((field) => {
  const min = field.min_value;
  const max = field.max_value;

  if (min > 0 && max / min >= LOG_SCALE_RATIO) {
    const logMin = Math.log(min);
    const logRange = Math.log(max) - logMin;
    return [field.field_name, {
      sliderMin: 0,
      sliderMax: LOG_STEPS,
      toValue: (position) => Math.round(Math.exp(logMin + logRange * position / LOG_STEPS)),
    }];
  }

  return [field.field_name, {sliderMin: min, sliderMax: max, toValue: (position) => position}];
}));

// Slider positions; converted to values via the field's scale.
const positions = reactive(Object.fromEntries(
    props.fields.map((field) => {
      const scale = scales[field.field_name];
      return [field.field_name, [scale.sliderMin, scale.sliderMax]];
    })
));

function range(fieldName) {
  return positions[fieldName].map(scales[fieldName].toValue);
}

function filter() {
  const filters = {};
  for (const field of props.fields) {
    const [min, max] = range(field.field_name);
    filters[field.field_name + "_ge"] = min;
    filters[field.field_name + "_le"] = max;
  }
  return filters;
}

watch(positions, () => emit('change', filter()), {deep: true, immediate: true});
</script>

<template>
  <div v-for="field of fields" :key="field.field_name" class="mt-5">
    <div class="d-flex justify-space-between text-body-medium mb-1">
      <span class="text-capitalize">{{ labels[field.field_name] ?? field.field_name }}</span>
      <span class="text-medium-emphasis">
        {{ range(field.field_name).map((v) => v.toLocaleString()).join(' – ') }}
      </span>
    </div>
    <v-range-slider v-model="positions[field.field_name]"
                    :min="scales[field.field_name].sliderMin"
                    :max="scales[field.field_name].sliderMax"
                    :step="1"
                    color="secondary"
                    hide-details
                    strict
    ></v-range-slider>
  </div>
</template>
