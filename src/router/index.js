import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress/nprogress.js";

// Import components
const Home = () => import("@/views/it-connect/Home.vue");
const Categories = () => import("@/views/it-connect/Categories.vue");
const Videos = () => import("@/views/it-connect/Videos.vue");
const Search = () => import("@/views/it-connect/Search.vue");
const Blog = () => import("@/views/it-connect/blog/BlogView.vue");
const Detail = () => import("@/views/it-connect/blog/DetailView.vue");
const BlogSimulate = () => import("@/views/one-ui/blog/BlogSimulate.vue");

const BlogAdmin = () => import("@/views/one-ui/blog/BlogAdmin.vue");
const BlogCreate = () => import("@/views/one-ui/blog/CreateBlog.vue");
const BlogEdit = () => import("@/views/one-ui/blog/EditBlog.vue");
const BlogViewDetail = () => import("@/views/one-ui/blog/BlogViewDetail.vue");
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

// Layouts
const MainLayout = () => import("@/layouts/variations/it-connect/MainLayout.vue");
const AdminLayout = () => import("@/layouts/variations/one-ui/AdminLayout.vue");
const LayoutSimple = () => import("@/layouts/variations/one-ui/Simple.vue");
const ContentLayout = () => import("@/layouts/variations/it-connect/ContentLayout.vue");

// Routes
const routes = [
  {
    path: "/auth",
    component: LayoutSimple,
    children: [
      {
        path: "signin",
        name: "AuthSignIn",
        component: AuthSignIn,
      },
    ],
  },
  {
    path: "/administrator",
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
            path: "edit", //đây là route để edit bài viết
            name: "AdminBlogEdit",
            component: BlogEdit,
            props: true,
          },
          {
            path: "viewdetail/:id", //đây là route để xem chi tiết bài viết
            name: "AdminBlogViewDetail",
            component: BlogViewDetail,
            props: true,
          },
          {
            path: "simulate",
            name: "AdminBlogSimulate",
            component: BlogSimulate,
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
    path: "/blog",
    component: ContentLayout,

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
      {
        path: "search",

        name: "Search",
        component: Search,
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
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress configuration
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

export default router;
