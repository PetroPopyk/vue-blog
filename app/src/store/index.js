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
    signIn({ dispatch }, form) {
      fb.auth
        .signInWithEmailAndPassword(form.email, form.password)
        .then((user) => {
          dispatch("fetchUserProfile", user);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    signUp({ dispatch }, form) {
      fb.auth
        .createUserWithEmailAndPassword(form.email, form.password)
        .then((user) => {
          fb.usersCollection
            .doc(user.uid)
            .set({
              name: form.name,
            })
            .then(() => {
              dispatch("fetchUserProfile", user);
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
          router.push("/");
        });
    },
  },
  modules: {},
});
