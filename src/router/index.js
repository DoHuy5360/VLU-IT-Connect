import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import NProgress from "nprogress/nprogress.js";

const Home = ()=> import("@/views/it-connect/Home.vue");

const MainLayout = () => import("@/layouts/variations/it-connect/MainLayout.vue");
const MasterPage = () => import("@/layouts/variations/master-page/MasterPage.vue")

const routes = [
  {
    path: "/",
    children: [
      {
        path: "/master",
        component: MasterPage,
      },
      {
        path: "/home",
        component: MainLayout,
        children : [
          {
            path: "",
            name: "Home",
            component: Home,
          }
        ]
      },
    ]
  },
];


const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});
/*eslint-enable no-unused-vars*/

export default router;
