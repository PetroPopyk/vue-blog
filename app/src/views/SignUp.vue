<template>
  <div class="auth-wrapper row valign-wrapper">
    <div class="z-depth-6 card-panel">
      <form class="login-form" @submit.prevent @submit="signUp">
        <div class="row">
          <h3>Sign-up</h3>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              class="validate"
              id="name"
              type="text"
              v-model="signUpForm.name"
              required
            />
            <label for="name" data-error="wrong" data-success="right"
              >Name</label
            >
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              class="validate"
              id="email"
              type="email"
              v-model="signUpForm.email"
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
              id="password"
              type="password"
              v-model="signUpForm.password"
              required
            />
            <label for="password">Password</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              type="submit"
              value="Sign-up"
              class="btn waves-effect waves-light col s12"
            />
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <a><router-link to="/sign-in">Back</router-link></a>
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
      signUpForm: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    signUp() {
      this.$store.dispatch("signUp", {
        name: this.signUpForm.name,
        email: this.signUpForm.email,
        password: this.signUpForm.password,
      });
    },
  },
};
</script>
