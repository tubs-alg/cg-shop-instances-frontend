<template>
  <v-container>
    <v-card max-width="600" :loading="loading" class="mx-auto">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit="login" @submit.prevent>
          <v-text-field label="Username"
                        v-model="user.username"
                        :error-messages="errors.username"></v-text-field>
          <v-text-field label="Password"
                        type="password"
                        v-model="user.password"
                        :error-messages="errors.password"></v-text-field>
          <v-btn type="submit">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'LoginView',
  components: {},
  data: function () {
    return {
      user: {
        username: "",
        password: "",
      },
      errors: {
        username: "",
        password: ""
      },
      loading: false
    }
  },
  mounted() {
    if (this.$store.state.auth.user) {
      this.$router.push('/profile');
    }
  },
  methods: {
    login() {
      this.loading = true;
      this.$store.dispatch("auth/login", this.user).then(
          () => {
            this.$router.push("/profile");
          },
          (error) => {
            this.loading = false;
            this.errors.username = (error.response &&
                    error.response.data && error.response.data.username) ||
                error.response.data.username;
            this.errors.password = (error.response &&
                    error.response.data && error.response.data.password) ||
                error.response.data.password;
          }
      );
    },
  }
}
</script>
