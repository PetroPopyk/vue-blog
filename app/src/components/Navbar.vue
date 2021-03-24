<template>
  <nav class="nav-wrapper">
    <div class="container row">
      <div class="col">
        <router-link to="/">Dashboard</router-link>
      </div>
      <ul class="right">
        <li>
          <router-link to="/settings">Settings</router-link>
        </li>
        <li>
          <a @click="logout()">Sign-out</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
  background: #2bbbad;
  a {
    font-size: 18px;
  }
}
</style>
