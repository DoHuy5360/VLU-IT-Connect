import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import NProgress from "nprogress/nprogress.js";

const Home = () => import("@/views/it-connect/Home.vue");
const Categories = () => import("@/views/it-connect/Categories.vue");
const Videos = () => import("@/views/it-connect/Videos.vue");
const Search = () => import("@/views/it-connect/Search.vue");
const Blog = () => import("@/views/it-connect/blog/BlogView.vue");
const Detail = () => import("@/views/it-connect/blog/DetailView.vue");

const BlogAdmin = () => import("@/views/one-ui/blog/BlogAdmin.vue");
const BlogCreate = () => import("@/views/one-ui/blog/CreateBlog.vue");
const BlogEdit = () => import("@/views/one-ui/blog/EditBlog.vue");
const CategoryAdmin = () => import("@/views/one-ui/category/Category.vue");
const CategoryCreate = () => import("@/views/one-ui/category/CreateCategory.vue");
const CategoryEdit = () => import("@/views/one-ui/category/EditCategory.vue");
const AccountAdmin = () => import("@/views/one-ui/account/AccountMain.vue");
const AccountCreate = () => import("@/views/one-ui/account/CreateAccount.vue");
const AccountEdit = () => import("@/views/one-ui/account/EditAccount.vue");
const AuthSignIn = () => import("@/views/one-ui/auth/SignIn.vue");
const AccountAdminManager = () => import("@/views/one-ui/accountmanager/AccountManager.vue");
const AccountManagerCreate = () => import("@/views/one-ui/accountmanager/CreateAccountManager.vue");
const AccountManagerEdit = () => import("@/views/one-ui/accountmanager/EditAccountManager.vue");

// Import layout
const MainLayout = () => import("@/layouts/variations/it-connect/MainLayout.vue");
const ContentLayout = () => import("@/layouts/variations/it-connect/ContentLayout.vue");
const MasterPage = () => import("@/layouts/variations/master-page/MasterPage.vue");
const AdminMasterPage = () => import("@/layouts/variations/master-page/AdminMasterPage.vue");
const AdminLayout = () => import("@/layouts/variations/one-ui/AdminLayout.vue");

const routes = [
    {
        path: "/",
        children: [
            {
                path: "administrator",
                name: "AdminPage",
                component: AdminLayout,
                children: [
                    {
                        path: "blog",
                        children: [
                            {
                                path: "",
                                name: "AdminBlog",
                                component: BlogAdmin,
                            },
                            {
                                path: "create",
                                name: "AdminBlogCreate",
                                component: BlogCreate,
                            },
                            {
                                path: "edit",
                                name: "AdminBlogEdit",
                                component: BlogEdit,
                            },
                        ],
                    },
                    {
                        path: "category",
                        children: [
                            {
                                path: "",
                                name: "AdminCategory",
                                component: CategoryAdmin,
                            },
                            {
                                path: "create",
                                name: "AdminCategoryCreate",
                                component: CategoryCreate,
                            },
                            {
                                path: "edit",
                                name: "AdminCategoryEdit",
                                component: CategoryEdit,
                            },
                        ],
                    },
                ],
            },
            {
                path: "master",
                meta: { breadcrumb: "Master" },
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
                                component: AdminMasterView,
                            },
                        ],
                    },
                ],
            },
            {
                path: "",
                children: [
                    {
                        path: "",
                        component: MainLayout,
                        children: [
                            {
                                path: "",
                                name: "HomePage",
                                component: Home,
                                meta: { breadcrumb: "Home" },
                            },
                        ],
                    },
                    {
                        path: "",
                        component: ContentLayout,
                        children: [
                            {
                                path: "categories",
                                name: "ListCategories",
                                component: Categories,
                                meta: {
                                    breadcrumb: "Categories",
                                    heroTitles: {
                                        website: ["Kiến thức CNTT", "Dành cho Sinh viên"],
                                        mobile: ["Kiến thức CNTT", "Dành cho Sinh viên"],
                                    },
                                },
                            },
                            {
                                path: "videos",
                                name: "ListVideos",
                                component: Videos,
                                meta: {
                                    breadcrumb: "Videos",
                                    heroTitles: {
                                        website: ["Video Clips Công Nghệ Thông Tin"],
                                        mobile: ["Video Clips Công Nghệ Thông Tin"],
                                    },
                                },
                            },
                            {
                                path: "search",
                                name: "ListResult",
                                component: Search,
                                meta: {
                                    breadcrumb: "Search",
                                    heroTitles: {
                                        website: [],
                                        mobile: ["Kết quả tìm kiếm"],
                                    },
                                },
                            },
                            {
                                path: "/blog",
                                children: [
                                    {
                                        path: "",
                                        name: "Blog",
                                        component: Blog,
                                        meta: {
                                            breadcrumb: "Videos",
                                            heroTitles: {
                                                website: ["Kiến thức Công Nghệ Thông Tin", "Dành cho Sinh viên"],
                                                mobile: ["Kiến thức CNTT", "Dành cho Sinh viên"],
                                            },
                                        },
                                    },
                                    {
                                        path: "detail",
                                        name: "Detail",
                                        component: Detail,
                                        meta: {
                                            breadcrumb: "Videos",
                                            heroTitles: {
                                                website: [],
                                                mobile: [],
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
<<<<<<< HEAD
    },
=======
      },
      {
        path: "category",
        children: [
          {
            path: "",
            name: "AdminCategory",
            component: CategoryAdmin,
          },
          {
            path: "create",
            name: "AdminCategoryCreate",
            component: CategoryCreate,
          },
          {
            path: "edit",
            name: "AdminCategoryEdit",
            component: CategoryEdit,
          },
        ],
      },
      {
        path: "accountmanager",
        children: [
          {
            path: "",
            name: "AdminAccountManager",
            component: AccountAdminManager,
          },
          {
            path: "create",
            name: "AdminAccountManagerCreate",
            component: AccountManagerCreate,
          },
          {
            path: "edit",
            name: "AdminAccountManagerEdit",
            component: AccountManagerEdit,
          },
        ],
      },
      {
        path: "account",
        children: [
          {
            path: "",
            name: "AdminAccount",
            component: AccountAdmin,
          },
          {
            path: "create",
            name: "AdminAccountCreate",
            component: AccountCreate,
          },
          {
            path: "edit",
            name: "AdminAccountEdit",
            component: AccountEdit,
          },
        ],
      },
    ],
  },

  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "HomePage",
        component: Home,
      },
      {
        path: "categories",
        name: "ListCategories",
        component: Categories,
      },
      {
        path: "videos",
        name: "ListVideos",
        component: Videos,
      },
      {
        path: "search",
        name: "ListResult",
        component: Search,
      },
      {
        path: "blog",
        children: [
          {
            path: "",
            name: "Blog",
            component: Blog,
          },
          {
            path: "detail",
            name: "Detail",
            component: Detail,
          },
        ],
      },
    ],
  },
>>>>>>> 974b6d2 (Feat: kết nối api sign in)
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
