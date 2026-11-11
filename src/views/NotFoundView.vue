<template>
  <v-container class="py-16">
    <v-empty-state
        icon="mdi-map-marker-question-outline"
        headline="404"
        title="Page not found"
        text="The page you are looking for does not exist or has been moved."
    >
      <template #actions>
        <v-btn color="primary" variant="flat" to="/" prepend-icon="mdi-home">Back to the start page</v-btn>
      </template>
    </v-empty-state>
  </v-container>
</template>
