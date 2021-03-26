<template>
  <div class="overlay" @click="closeModal()">
    <div class="card-panel left-align col s12" @click.stop>
      <h4>{{ post.title }}</h4>
      <p>{{ post.text }}</p>
      <p>Posted by {{ post.userName }} - {{ post.createdOn | date }}</p>

      <div class="border"></div>

      <div class="col s12">
        <template v-if="post.comments.length">
          <h5>Comments</h5>
        </template>
        <template v-else>
          <h6 class="center-align">No comments yet</h6>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["post"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .card-panel {
    width: 60%;

    .border {
      height: 1px;
      background: #2bbbad;
      margin: 20px 0;
    }
  }
}
</style>
