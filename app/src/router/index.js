import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard";
import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import('../views/Login'),
    meta: {
      requiresNotAuth: true
    }
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import('../views/Settings'),
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const requiresNotAuth = to.matched.some(x => x.meta.requiresNotAuth);

  if (requiresAuth && !auth.currentUser) {
    next('/login');
  } else {
    next();
  }

  if (requiresNotAuth && auth.currentUser) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
