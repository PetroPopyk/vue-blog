<template>
  <div class="auth-wrapper row valign-wrapper">
    <div class="z-depth-6 card-panel">
      <form class="login-form" @submit.prevent @submit="resetPassword">
        <div class="row">
          <h3>Reset password</h3>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              class="validate"
              id="email"
              type="email"
              v-model="resetPasswordForm.email"
              required
            />
            <label for="email" data-error="wrong" data-success="right"
              >Email</label
            >
          </div>
        </div>
        <div class="row" v-if="errorMessage">
          <div class="input-field col s12">
            <span class="red-text">{{ errorMessage }}</span>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              type="submit"
              value="Reset"
              class="btn waves-effect waves-light col s12"
            />
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <router-link to="/sign-in">Back</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import router from "@/router";
import Vue from "vue";

export default {
  data() {
    return {
      resetPasswordForm: {
        email: "",
      },
      errorMessage: null,
    };
  },
  methods: {
    resetPassword() {
      this.errorMessage = null;
      auth
        .sendPasswordResetEmail(this.resetPasswordForm.email)
        .then(() => {
          Vue.notify({
            text: "Reset password instructions sent to the mail!",
            type: "success",
          });
          router.push("/sign-in");
        })
        .catch((err) => {
          this.errorMessage = err;
        });
    },
  },
};
</script>
