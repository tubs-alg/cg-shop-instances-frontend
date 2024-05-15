<template>
  <v-container>
    <h1>Profile Page</h1>
    <div v-if="this.currentUser">
      <h4>Access</h4>
      <code>
        {{ truncate(this.currentUser.access) }}
      </code>
      <h4>Refresh</h4>
      <code>
        {{ truncate(this.currentUser.refresh) }}
      </code>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ProfileView',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    truncate() {
      return (text) => {
        const suffix = '...';
        const length = 80;

        if (text.length > length) {
          return text.substring(0, length) + suffix;
        } else {
          return text;
        }
      }
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>
