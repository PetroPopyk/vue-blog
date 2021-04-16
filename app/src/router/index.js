import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard";
import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/sign-in",
    name: "Sign-in",
    component: () => import("../views/SignIn"),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: "/sign-up",
    name: "Sign-up",
    component: () => import("../views/SignUp"),
    meta: {
      requiresNotAuth: true,
    },
  },
  {
    path: "/not-found",
    name: "Not-found",
    component: () => import("../views/NotFound"),
  },
  {
    path: "/reset-password",
    name: "Reset-password",
    component: () => import("../views/ResetPassword"),
  },
  {
    path: "*",
    redirect: "/not-found",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  const requiresNotAuth = to.matched.some((x) => x.meta.requiresNotAuth);

  if (requiresAuth && !auth.currentUser) {
    next("/sign-in");
  } else {
    next();
  }

  if (requiresNotAuth && auth.currentUser) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
