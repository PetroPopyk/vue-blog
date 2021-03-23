<template>
    <div id="login-wrapper" class="row valign-wrapper">
      <div class="z-depth-6 card-panel">
        <form class="login-form" @submit.prevent>
          <div class="row">
            <h3>Welcome!</h3>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input class="validate" id="email" type="email" v-model="loginForm.email">
              <label for="email" data-error="wrong" data-success="right">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="password" type="password" v-model="loginForm.password">
              <label for="password">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <a href="#" class="btn waves-effect waves-light col s12">Login</a>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s6 m6 l6">
              <p class="margin medium-small"><a>Create Account</a></p>
            </div>
            <div class="input-field col s6 m6 l6">
              <p class="margin medium-small"><a>Forgot password?</a></p>
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
    loginForm: {
      email: "",
      password: ""
    }
  }
}
}
</script>

<style lang="scss" scoped>
#login-wrapper {
  height: 100%;
  background: #2bbbad;

  .card-panel {
    width: 500px;
    margin: 0 auto;
  }
}
</style>