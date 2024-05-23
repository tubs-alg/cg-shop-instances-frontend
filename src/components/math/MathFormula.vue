<script setup>

</script>

<template>
  <span v-katex:auto>\({{ formula }}\)</span>
</template>

<script>

export default {
  name: "MathFormula",
  props: {
    formula: String
  }
}
</script>