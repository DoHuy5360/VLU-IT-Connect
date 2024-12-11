import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress/nprogress.js";

// Import components
const Home = () => import("@/views/it-connect/Home.vue");
const Categories = () => import("@/views/it-connect/Categories.vue");
const Videos = () => import("@/views/it-connect/Videos.vue");
const Search = () => import("@/views/it-connect/Search.vue");
const Blog = () => import("@/views/it-connect/blog/Blog.vue");
const Detail = () => import("@/views/it-connect/blog/Detail.vue");

const BlogAdmin = () => import("@/views/one-ui/blog/Blog.vue");
const BlogCreate = () => import("@/views/one-ui/blog/CreateBlog.vue");
const BlogEdit = () => import("@/views/one-ui/blog/EditBlog.vue");
const CategoryAdmin = () => import("@/views/one-ui/category/Category.vue");
const CategoryCreate = () => import("@/views/one-ui/category/CreateCategory.vue");
const CategoryEdit = () => import("@/views/one-ui/category/EditCategory.vue");
const AccountAdmin = () => import("@/views/one-ui/account/Account.vue");
const AccountCreate = () => import("@/views/one-ui/account/CreateAccount.vue");
const AccountEdit = () => import("@/views/one-ui/account/EditAccount.vue");
const AuthSignIn = () => import("@/views/one-ui/auth/SignIn.vue");

// Layouts
const MainLayout = () => import("@/layouts/variations/it-connect/MainLayout.vue");
const AdminLayout = () => import("@/layouts/variations/one-ui/AdminLayout.vue");
const LayoutSimple = () => import("@/layouts/variations/one-ui/Simple.vue");

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
