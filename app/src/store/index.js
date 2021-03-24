import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userProfile: {},
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
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
  },
  modules: {},
});
