import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "@/router";
import { orderBy } from "lodash";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: {
      data: [],
      last: {},
      isLast: false,
    },
    upcomingPosts: [],
  },
  mutations: {
    setUserProfile(state, userProfile) {
      state.userProfile = userProfile;
    },
    setPosts(state, data) {
      state.posts.data = orderBy(
        [...state.posts.data, ...data.posts],
        ["createdOn"],
        ["desc"]
      );
      if (data.lastPost) {
        state.posts.last = data.lastPost;

        if (data.posts.length < 3) {
          state.posts.isLast = true;
        }
      }
    },
    setNewPosts(state, data) {
      if (data) {
        state.upcomingPosts.push(data);
      } else {
        state.upcomingPosts = [];
      }
    },
    updateExistingPost(state, post) {
      const recentPost = state.posts.data.find(
        (existedPost) => existedPost.id === post.id
      );
      recentPost.comments = post.comments;
      recentPost.likes = post.likes;
    },
    updateUpcomingPost(state, post) {
      const recentPost = state.upcomingPosts.find(
        (existedPost) => existedPost.id === post.id
      );
      recentPost.comments = post.comments;
      recentPost.likes = post.likes;
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    signIn({ dispatch }, form) {
      fb.auth
        .signInWithEmailAndPassword(form.email, form.password)
        .then(() => {
          router.push("/");
        })
        .catch((err) => {
          Vue.notify({
            text: err.message,
            type: "error",
          });
        });
    },

    // eslint-disable-next-line no-unused-vars
    signUp({ dispatch }, form) {
      fb.auth
        .createUserWithEmailAndPassword(form.email, form.password)
        .then((user) => {
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: form.name,
            })
            .then(() => {
              router.push("/");
              Vue.notify({
                text: "Successfully signed-up!",
                type: "success",
              });
            });
        })
        .catch((err) => {
          Vue.notify({
            text: err.message,
            type: "error",
          });
        });
    },

    fetchUserProfile({ commit }, user) {
      fb.usersCollection
        .doc(user.uid)
        .get()
        .then((userProfile) => {
          commit("setUserProfile", userProfile.data());
        });
    },

    logout({ commit }) {
      fb.auth.signOut().then(() => {
        commit("setUserProfile", {});
        router.push("/sign-in");
        Vue.notify({
          text: "Successfully logged-out!",
          type: "success",
        });
      });
    },

    getPosts({ commit }) {
      fb.postsCollection
        .orderBy("createdOn", "desc")
        .startAfter(store.state.posts.last)
        .limit(3)
        .get()
        .then((snapshot) => {
          const posts = [];
          const lastPost = snapshot.docs[snapshot.docs.length - 1];
          snapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id });
          });
          commit("setPosts", { posts, lastPost });
        })
        .catch((err) => {
          Vue.notify({
            text: err.message,
            type: "error",
          });
        });
    },

    getNewPosts({ state, commit }) {
      commit("setPosts", { posts: state.upcomingPosts });
      commit("setNewPosts", null);
    },

    createPost({ state, commit }, post) {
      const payload = {
        ...post,
        createdOn: new Date().toISOString(),
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0,
      };
      fb.postsCollection
        .add(payload)
        .then((doc) => {
          doc.get().then((postSnapshot) => {
            const post = { ...postSnapshot.data(), id: doc.id };
            commit("setPosts", { posts: [post] });
            Vue.notify({
              text: "Post created!",
              type: "success",
            });
          });
        })
        .catch((err) => {
          Vue.notify({
            text: err.message,
            type: "error",
          });
        });
    },

    addComment({ state }, data) {
      const payload = {
        ...data,
        createdOn: new Date().toISOString(),
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
      };
      fb.commentsCollection
        .add(payload)
        .then(() => {
          fb.postsCollection.doc(data.postId).update({
            comments: parseInt(data.commentsCount) + 1,
          });
          Vue.notify({
            text: "Comment added!",
            type: "success",
          });
        })
        .catch((err) => {
          Vue.notify({
            text: err.message,
            type: "error",
          });
        });
    },

    // eslint-disable-next-line no-unused-vars
    like({ dispatch }, data) {
      const payload = {
        ...data,
        userId: fb.auth.currentUser.uid,
      };
      fb.likesCollection
        .add(payload)
        .then(() => {
          fb.postsCollection.doc(data.postId).update({
            likes: parseInt(data.likesCount) + 1,
          });
        })
        .catch((err) => {
          Vue.notify({
            text: err.message,
            type: "error",
          });
        });
    },

    // eslint-disable-next-line no-unused-vars
    unlike({ dispatch }, data) {
      const likeToRemove = data.find(
        (like) => like.userId === fb.auth.currentUser.uid
      );
      fb.likesCollection
        .doc(likeToRemove.id)
        .delete()
        .then(() => {
          fb.postsCollection.doc(likeToRemove.postId).update({
            likes: parseInt(data.length) - 1,
          });
        })
        .catch((err) => {
          Vue.notify({
            text: err.message,
            type: "error",
          });
        });
    },
  },
  modules: {},
});

fb.postsCollection
  .orderBy("createdOn", "desc")
  .limit(1)
  .onSnapshot((snapshot) => {
    if (store.state.posts.data.length > 0) {
      const newPostData = {
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id,
      };
      if (newPostData.userId !== fb.auth.currentUser.uid) {
        if (
          !store.state.posts.data.find((post) => post.id === newPostData.id)
        ) {
          if (
            !store.state.upcomingPosts.find(
              (post) => post.id === newPostData.id
            )
          ) {
            store.commit("setNewPosts", newPostData);
          } else {
            store.commit("updateUpcomingPost", newPostData);
          }
        }
      }

      if (store.state.posts.data.find((post) => post.id === newPostData.id)) {
        store.commit("updateExistingPost", newPostData);
      }
    }
  });

export default store;
