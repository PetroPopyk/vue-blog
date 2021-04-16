<template>
  <div class="overlay" @click="closeModal()">
    <div
      class="card-panel left-align col s12"
      @click.stop
      v-if="comments !== null"
    >
      <div class="flex justify-between align-center">
        <h4>{{ post.title }}</h4>
        <div class="flex align-center">
          <span
            class="heart-icon"
            v-bind:class="{ liked: likes.find((e) => e.userId === userId) }"
            @click="likes.find((e) => e.userId === userId) ? unlike() : like()"
            >&#9829;</span
          >
          <span>{{ likes.length }}</span>
        </div>
      </div>
      <p>{{ post.text }}</p>
      <p class="grey-text">
        Posted by {{ post.userName }} - {{ post.createdOn | date }}
      </p>

      <div class="border"></div>

      <div class="col s12 comment-wrapper">
        <template v-if="comments.length">
          <h5>Comments</h5>
          <div
            class="col s12 comment-item"
            v-for="comment in comments"
            :key="comment.id"
          >
            <h6>{{ comment.text }}</h6>
            <p class="grey-text">
              Commented by {{ comment.userName }} -
              {{ comment.createdOn | date }}
            </p>
          </div>
        </template>
        <template v-else>
          <h5 class="center-align">No comments yet</h5>
        </template>
      </div>

      <div class="border"></div>

      <form @submit.prevent @submit="addComment">
        <h5>Add Comment</h5>
        <div class="input-field col s12">
          <textarea
            class="materialize-textarea"
            name="comment-description"
            required
            v-model.trim="addCommentForm.text"
          ></textarea>
        </div>
        <div class="input-field col s12">
          <input
            type="submit"
            value="Add comment"
            class="btn waves-effect waves-light"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as fb from "@/firebase";

export default {
  props: ["post"],
  data() {
    return {
      userId: fb.auth.currentUser.uid,
      comments: [],
      likes: [],
      addCommentForm: {
        text: "",
        postId: this.post.id,
        commentsCount: this.post.comments,
      },
      likeForm: {
        postId: this.post.id,
        likesCount: this.post.likes,
      },
      commentListener: null,
      likesListener: null,
    };
  },
  beforeMount() {
    this.getComments();
    this.getLikes();
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    addComment() {
      this.$store.dispatch("addComment", this.addCommentForm);
      this.addCommentForm.text = "";
    },
    like() {
      this.$store.dispatch("like", this.likeForm);
    },
    unlike() {
      this.$store.dispatch("unlike", this.likes);
    },
    getComments() {
      this.commentListener = fb.commentsCollection
        .where("postId", "==", this.post.id)
        .orderBy("createdOn", "desc")
        .onSnapshot((snapshot) => {
          const comments = [];
          snapshot.forEach((doc) => {
            comments.push({ ...doc.data(), id: doc.id });
          });
          this.comments = comments;
        });
    },
    getLikes() {
      this.likesListener = fb.likesCollection
        .where("postId", "==", this.post.id)
        .onSnapshot((snapshot) => {
          const likes = [];
          snapshot.forEach((doc) => {
            likes.push({ ...doc.data(), id: doc.id });
          });
          this.likes = likes;
        });
    },
  },
  beforeDestroy() {
    this.commentListener();
    this.likesListener();
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

    .heart-icon {
      float: right;
      font-size: 30px;
      line-height: 2.28rem;
      color: #d0e8e6;
      margin-right: 4px;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        color: #2bbbad;
      }

      &.liked {
        color: #2bbbad;
        &:hover {
          color: #d0e8e6;
        }
      }
    }

    .border {
      height: 1px;
      background: #2bbbad;
      margin: 20px 0;
    }
  }
}

.comment-wrapper {
  max-height: 300px;
  overflow: auto;

  .comment-item {
    padding-left: 20px;
    border-left: 1px solid #2bbbad;
  }
}
</style>
