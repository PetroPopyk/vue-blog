<template>
  <div id="app">
    <Navbar v-if="userLoggedIn"></Navbar>
    <router-view />
    <notifications position="bottom right" />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import { mapState } from "vuex";

export default {
  components: {
    Navbar,
  },
  computed: {
    ...mapState(["userProfile"]),
    userLoggedIn() {
      return Object.keys(this.userProfile).length > 0;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
