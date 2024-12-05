import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import NProgress from "nprogress/nprogress.js";

const Home = ()=> import("@/views/it-connect/Home.vue");
const AdminMasterView = ()=> import("@/views/one-ui/AdminMasterView.vue");

// Import layout
const MainLayout = () => import("@/layouts/variations/it-connect/MainLayout.vue");
const MasterPage = () => import("@/layouts/variations/master-page/MasterPage.vue")
const AdminMasterPage = () => import("@/layouts/variations/master-page/AdminMasterPage.vue")
const AdminLayout = () =>  import("@/layouts/variations/one-ui/AdminLayout.vue");


const routes = [
  {
    path: "/",
    children: [
      {
        path: "administrator",
        name: "AdminPage",
        component: AdminLayout,
        // children: [
        //   {
        //     path: "",
        //     name: "AdminPage",
        //     component: Dashboard
        //   }
        // ]
      },
      {
        path: "master",
        meta: {breadcrumb: "Master"},
        children: [
          {
            path: "",
            name: "MasterGuest",
            component: MasterPage,
          },
          {
            path: "administrator",
            component: AdminMasterPage,
            children: [
              {
                path: "",
                name: "MasterAdminView",
                component: AdminMasterView
              }
            ]
          },
        ],
      },
      {
        path: "",
        component: MainLayout,
        children : [
          {
            path: "",
            name: "HomePage",
            component: Home,
            meta: {breadcrumb: "Home"}
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
