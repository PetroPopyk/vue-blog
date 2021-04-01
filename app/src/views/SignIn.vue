<template>
  <div class="auth-wrapper row valign-wrapper">
    <div class="z-depth-6 card-panel">
      <form class="login-form" @submit.prevent @submit="signIn">
        <div class="row">
          <h3>Sign-in</h3>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              class="validate"
              id="email"
              type="email"
              v-model="signInForm.email"
              required
            />
            <label for="email" data-error="wrong" data-success="right"
              >Email</label
            >
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              class="validate"
              id="password"
              type="password"
              v-model="signInForm.password"
              required
            />
            <label for="password">Password</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              type="submit"
              value="Sign-in"
              class="btn waves-effect waves-light col s12"
            />
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6 m6 l6">
            <p class="margin medium-small">
              <router-link to="/sign-up">Create Account</router-link>
            </p>
          </div>
          <div class="input-field col s6 m6 l6">
            <p class="margin medium-small">
              <router-link to="/reset-password">Forgot password?</router-link>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      signInForm: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    signIn() {
      this.$store.dispatch("signIn", this.signInForm);
    },
  },
};
</script>
