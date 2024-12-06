import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import NProgress from "nprogress/nprogress.js";

const Home = ()=> import("@/views/it-connect/Home.vue");
const Categories = ()=> import("@/views/it-connect/Categories.vue");
const Search = ()=> import("@/views/it-connect/Search.vue");
const AdminMasterView = ()=> import("@/views/one-ui/AdminMasterView.vue");

// Import layout
const MainLayout = () => import("@/layouts/variations/it-connect/MainLayout.vue");
const ContentLayout = () => import("@/layouts/variations/it-connect/ContentLayout.vue");
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
        children : [
          {
            path: "",
            component: MainLayout,
            children: [
              {
                path: "",
                name: "HomePage",
                component: Home,
                meta: {breadcrumb: "Home"}
              },
            ]
          },
          {
            path: "",
            component: ContentLayout,
            children : [
              {
                path: "/categories",
                name: "ListCategories",
                component: Categories,
                meta: {breadcrumb: "Categories", heroTitles: {
                  website: [
                    "Kiến thức CNTT",
                    "Dành cho Sinh viên"
                  ],
                  mobile: [
                    "Kiến thức CNTT",
                    "Dành cho Sinh viên"
                  ],
                }}
              },
              {
                path: "/search",
                name: "ListResult",
                component: Search,
                meta: {breadcrumb: "Search", heroTitles: {
                  website: [],
                  mobile: [
                    "Kết quả tìm kiếm"
                  ]
                }}
              }
            ]
          },
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
