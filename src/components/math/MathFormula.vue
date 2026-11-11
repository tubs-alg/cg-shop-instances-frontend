<script setup>
import {computed} from "vue";
import katex from "katex";

const props = defineProps({
  formula: String
})

const html = computed(() => katex.renderToString(props.formula ?? "", {throwOnError: false}))
</script>

<template>
  <span v-html="html"></span>
</template>
