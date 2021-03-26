<template>
  <div class="dashboard-wrapper" v-if="userLoggedIn">
    <transition name="fade">
      <Post
        v-if="showPostModal"
        :post="selectedPost"
        @close="viewFullPost()"
      ></Post>
    </transition>

    <div class="row">
      <div class="card-panel col s4 left-align z-depth-6">
        <form @submit.prevent @submit="createPost">
          <h5>{{ userProfile.name }}</h5>
          <h6>Create a post</h6>
          <div class="input-field col s12">
            <input
              type="text"
              id="post-title"
              required
              v-model.trim="createPostForm.title"
            />
            <label for="post-title">Title</label>
          </div>
          <div class="input-field col s12">
            <textarea
              class="materialize-textarea"
              name="post-text"
              id="post-text"
              required
              v-model.trim="createPostForm.text"
            ></textarea>
            <label for="post-text">Description</label>
          </div>
          <div class="input-field col s12">
            <input
              type="submit"
              value="Create"
              class="btn waves-effect waves-light col s12"
            />
          </div>
        </form>
      </div>

      <div class="card-panel col s7 offset-s1 z-depth-6">
        <template v-if="posts.data.length">
          <div
            class="col s12 left-align"
            v-for="(post, index) in posts.data"
            :key="post.id"
            v-bind:class="{ border: index + 1 !== posts.data.length }"
          >
            <h5>{{ post.title }}</h5>
            <h6>{{ post.text }}</h6>
            <p>Posted by {{ post.userName }} - {{ post.createdOn | date }}</p>
            <p>
              <span>{{ post.comments }} comments</span>
              <span>{{ post.likes }} likes </span>
              <a @click="viewFullPost(post)">View...</a>
            </p>
          </div>
        </template>
        <h6 v-else>No posts yet</h6>
        <div
          class="input-field col s12"
          v-if="posts.data.length && !posts.isLast"
        >
          <input
            @click="getMorePosts()"
            type="button"
            value="Load more..."
            class="btn waves-effect waves-light col s12"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Post from "@/components/Post";

export default {
  components: {
    Post,
  },
  data() {
    return {
      createPostForm: {
        title: "",
        text: "",
      },
      showPostModal: false,
      selectedPost: {},
    };
  },
  computed: {
    ...mapState(["userProfile", "posts"]),
    userLoggedIn() {
      return Object.keys(this.userProfile).length > 0;
    },
  },
  methods: {
    createPost() {
      this.$store.dispatch("createPost", this.createPostForm);
      this.createPostForm.title = "";
      this.createPostForm.text = "";
    },
    getMorePosts() {
      this.$store.dispatch("getMorePosts");
    },
    viewFullPost(post) {
      this.showPostModal = !this.showPostModal;
      this.showPostModal
        ? (this.selectedPost = post)
        : (this.selectedPost = {});
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
  padding: 120px 15%;
  background: #d0e8e6;
  position: relative;

  .card-panel {
    padding: 15px;
    border-radius: 4px;

    span {
      margin-right: 16px;
    }

    a {
      cursor: pointer;
      float: right;
    }

    h6 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:last-child {
      max-height: 700px;
      overflow: auto;
    }
  }

  .input-field {
    padding: 0;

    label {
      left: 0;
    }
  }

  .border {
    border-bottom: 1px solid #29bbad;
  }
}
</style>
