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
      recentlyCreated: false,
    },
  },
  mutations: {
    setUserProfile(state, userProfile) {
      state.userProfile = userProfile;
    },
    setPosts(state, data) {
      data.posts.map((newPost) => {
        if (!state.posts.data.find((oldPost) => oldPost.id === newPost.id)) {
          state.posts.data.push(newPost);
        }
      });
      state.posts.data = orderBy(state.posts.data, ["createdOn"], ["desc"]);
      state.posts.last = data.lastPost;
      if (data.posts.length < 3) {
        state.posts.isLast = true;
      }
    },
    setRecentlyPushed(state, val) {
      state.posts.recentlyCreated = val;
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
          console.log(err);
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
            });
        })
        .catch((err) => {
          console.log(err);
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
      });
    },
    // eslint-disable-next-line no-unused-vars
    createPost({ state, commit }, post) {
      store.commit("setRecentlyPushed", true);
      fb.postsCollection
        .add({
          ...post,
          createdOn: new Date().toISOString(),
          userId: fb.auth.currentUser.uid,
          userName: state.userProfile.name,
          comments: 0,
          likes: 0,
        })
        .finally(() => {
          store.commit("setRecentlyPushed", false);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // eslint-disable-next-line no-unused-vars
    getMorePosts() {
      fb.postsCollection
        .orderBy("createdOn", "desc")
        .startAfter(store.state.posts.last)
        .limit(3)
        .get()
        .then((snapshot) => {
          const posts = [];
          const lastPost = snapshot.docs[snapshot.docs.length - 1];
          snapshot.forEach((doc) => {
            let post = doc.data();
            post.id = doc.id;
            posts.push(post);
          });
          store.commit("setPosts", { posts, lastPost });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addComment({ state }, comment) {
      fb.commentsCollection
        .add({
          ...comment,
          createdOn: new Date().toISOString(),
          userId: fb.auth.currentUser.uid,
          userName: state.userProfile.name,
        })
        .then(() => {
          fb.postsCollection.doc(comment.postId).update({
            comments: parseInt(comment.commentsCount) + 1,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  modules: {},
});

fb.postsCollection
  .orderBy("createdOn", "desc")
  .startAfter(store.state.posts.last)
  .limit(3)
  .onSnapshot((snapshot) => {
    const posts = [];
    const lastPost = store.state.posts.recentlyCreated
      ? store.state.posts.last
      : snapshot.docs[snapshot.docs.length - 1];
    snapshot.forEach((doc) => {
      let post = doc.data();
      post.id = doc.id;
      posts.push(post);
    });
    store.commit("setPosts", { posts, lastPost });
  });

export default store;
