<template>
  <nav class="nav-wrapper">
    <div class="container row">
      <ul>
        <li>
          <router-link to="/">Dashboard</router-link>
        </li>
      </ul>
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
  position: absolute;
  z-index: 1;
  a {
    font-size: 18px;
  }
}
</style>
