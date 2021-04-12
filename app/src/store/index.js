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
            let post = doc.data();
            post.id = doc.id;
            posts.push(post);
          });
          commit("setPosts", { posts, lastPost });
        })
        .catch((err) => {
          console.log(err);
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
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addComment({ state }, comment) {
      const payload = {
        ...comment,
        createdOn: new Date().toISOString(),
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
      };
      fb.commentsCollection
        .add(payload)
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
  .limit(1)
  .onSnapshot((snapshot) => {
    if (store.state.posts.data.length > 0) {
      const newPostData = {
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id,
      };
      if (newPostData.userId !== fb.auth.currentUser.uid) {
        console.log(newPostData);
        if (
          !store.state.posts.data.find((post) => post.id === newPostData.id)
        ) {
          store.commit("setNewPosts", newPostData);
        }
      }
    }
  });

export default store;
