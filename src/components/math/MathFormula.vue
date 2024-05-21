<script setup>

</script>

<template>
  <span>\({{ formula }}\)</span>
</template>

<script>

export default {
  name: "MathJax",
  props: {
    formula: String
  }
}
</script>