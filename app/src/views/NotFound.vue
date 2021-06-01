<template>
  <div class="not-found-wrapper valign-wrapper">
    <div class="row">
      <h3 class="col s12">Page not found</h3>
      <router-link class="black-text" to="/">Go back</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-wrapper {
  background: #d0e8e6;

  a {
    font-size: 18px;
    text-decoration: underline;
  }
}
</style>
