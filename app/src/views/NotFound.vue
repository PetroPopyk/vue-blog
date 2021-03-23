<template>
  <div class="not-found-wrapper valign-wrapper">
    <div class="row">
      <h3 class="col s12">Page not found</h3>
      <router-link class="black-text underlined" to="/">Go back</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-wrapper {
  background: #2bbbad;

  a {
    font-size: 18px;
    text-decoration: underline;
  }
}
</style>